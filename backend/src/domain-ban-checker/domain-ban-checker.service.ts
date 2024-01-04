import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Cron, CronExpression } from '@nestjs/schedule';
import { WebsitesService } from '../websites/websites.service';
import { Website } from '../websites/entities/website.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LastCommitDate } from './entities/last-commit-date.entity';
import { BlockedDomain } from './entities/blocked-domain.entity';
import * as csvParser from 'csv-parser';
import * as punycode from 'punycode';
import * as iconv from 'iconv-lite';
import { Readable } from 'stream';
@Injectable()
export class DomainBanCheckerService {
  private readonly logger = new Logger(DomainBanCheckerService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly websitesService: WebsitesService,
    @InjectRepository(LastCommitDate)
    private lastCommitDateRepository: Repository<LastCommitDate>,
    @InjectRepository(BlockedDomain)
    private blockedDomainRepository: Repository<BlockedDomain>,
    @InjectRepository(Website)
    private websiteRepository: Repository<Website>,
  ) {}

  @Cron('0 */15 * * * *') // CronExpression.EVERY_MINUTE
  async handleCron() {
    await this.cronTask();
  }

  // Get all app websites from database
  async getAllMineWebsites(): Promise<string[]> {
    const websites = await this.websitesService.findAll();
    const websiteDomainNames = websites.map((website) => website.domainName);
    // this.logger.log(`Found ${websiteDomainNames.length} websites in database`);
    return websiteDomainNames;
  }

  // Check if data need to be updated by comparing last commit date from repo with last commit date from database
  lastCommitDateFromRepo: Date;
  async checkIfDataNeedsToBeUpdated(
    isManual: boolean = false,
  ): Promise<boolean> {
    const getLastCommitDateFromRepo = async (): Promise<Date> => {
      try {
        const response = await this.httpService
          .get(
            'https://api.github.com/repos/zapret-info/z-i/commits?path=dump.csv&page=1&per_page=1',
          )
          .toPromise();

        const lastCommitDate = response.data[0].commit.author.date;
        return new Date(lastCommitDate);
      } catch (error) {
        this.logger.error(error.response.data.message);
      }
    };

    this.lastCommitDateFromRepo = await getLastCommitDateFromRepo();

    let lastCommitDateFromDatabase =
      (await this.lastCommitDateRepository.findOne({
        where: { id: 1 },
      })) ?? { date: new Date(0) };

    if (
      this.lastCommitDateFromRepo.getTime() !==
      lastCommitDateFromDatabase.date.getTime()
    ) {
      this.logger.log(
        'Commit date in database not equal with commit date in repo',
      );
    }

    return (
      isManual ||
      this.lastCommitDateFromRepo.getTime() !==
        lastCommitDateFromDatabase.date.getTime()
    );
  }

  async downloadAndSaveCsvData(): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        this.logger.log('Downloading CSV data');
        const csvUrl =
          'https://raw.githubusercontent.com/zapret-info/z-i/master/dump.csv';
        const response = await this.httpService
          .get(csvUrl, { responseType: 'arraybuffer' })
          .toPromise();

        await this.blockedDomainRepository.clear();
        this.logger.log('Existing data cleared from the database');

        const bulkData = [];
        const bulkSize = 1000; // Размер пакета для сохранения

        // Преобразование данных из Windows-1251 в UTF-8
        const buffer = Buffer.from(response.data);
        const utf8Stream = Readable.from(iconv.decode(buffer, 'windows-1251'));

        utf8Stream
          .pipe(
            csvParser({
              separator: ';',
              headers: [
                'ipRanges',
                'domainName',
                'additionalInfo1',
                'regulator',
                'orderRef',
                'decisionDate',
              ],
            }),
          )
          .on('data', (data) => {
            // Добавляем только интересующее нас поле - domainName
            if (data.domainName) {
              bulkData.push(
                this.blockedDomainRepository.create({
                  domainName: data.domainName,
                }),
              );
            }

            if (bulkData.length >= bulkSize) {
              utf8Stream.pause(); // Останавливаем поток данных
              this.blockedDomainRepository
                .save(bulkData.splice(0, bulkSize))
                .then(() => utf8Stream.resume()) // Продолжаем после сохранения
                .catch((error) => {
                  this.logger.error('Error saving bulk data', error);
                  reject(error); // Отклоняем обещание при ошибке
                });
            }
          })
          .on('end', async () => {
            if (bulkData.length > 0) {
              await this.blockedDomainRepository.save(bulkData); // Сохраняем оставшиеся данные
            }
            this.logger.log(
              'CSV data successfully processed and saved to the database',
            );
            resolve();
          });
      } catch (error) {
        this.logger.error('Error downloading or saving CSV data', error);
        reject(error);
      }
    });
  }

  async saveLastCommitDate(): Promise<LastCommitDate> {
    const lastCommitDate = this.lastCommitDateRepository.create({
      id: 1,
      date: this.lastCommitDateFromRepo,
    });
    this.logger.log('Last commit date updated in database');
    return this.lastCommitDateRepository.save(lastCommitDate);
  }

  async cronTask(): Promise<void> {
    const websites = await this.getAllMineWebsites();
    if (websites.length !== 0) {
      const dataNeedsToBeUpdated = await this.checkIfDataNeedsToBeUpdated();
      if (dataNeedsToBeUpdated) {
        await this.downloadAndSaveCsvData();
        await this.saveLastCommitDate();
        await this.checkRoskomnadzorBan();
      }
    } else {
      this.logger.log('No domains to check');
    }
  }

  private async getBannedDomains(): Promise<string[]> {
    const bannedDomains = await this.blockedDomainRepository.find();
    const bannedDomainNames = bannedDomains.map(
      (bannedDomain) => bannedDomain.domainName,
    );
    return bannedDomainNames;
  }

  async checkRoskomnadzorBan(): Promise<void> {
    const domainsToCheck = await this.getAllMineWebsites();
    if (domainsToCheck.length === 0) {
      this.logger.log('No domains found to check Roskomnadzor ban');
      return;
    } else {
      this.logger.log(`Checking ${domainsToCheck.length} domains`);
      const bannedDomains = await this.getBannedDomains();

      const mineBannedDomains = domainsToCheck.filter((domainToCheck) => {
        const domainToCheckPuny = domainToCheck.startsWith('xn--')
          ? domainToCheck
          : punycode.toASCII(domainToCheck);

        return bannedDomains.some((bannedDomain) => {
          if (!bannedDomain) return false;

          const normalizedBannedDomain = bannedDomain.replace('*.', '');
          const normalizedBannedDomainPuny = normalizedBannedDomain.startsWith(
            'xn--',
          )
            ? normalizedBannedDomain
            : punycode.toASCII(normalizedBannedDomain);

          return (
            domainToCheckPuny === normalizedBannedDomainPuny ||
            domainToCheckPuny.endsWith('.' + normalizedBannedDomainPuny)
          );
        });
      });

      if (mineBannedDomains.length > 0) {
        this.logger.warn(
          `Roskomnadzor banned domains found: ${mineBannedDomains.join(', ')}`,
        );

        for (const bannedDomain of mineBannedDomains) {
          await this.updateWebsite(bannedDomain, true);
        }
      } else {
        this.logger.log('No banned domains found');
      }
    }
  }

  async updateWebsite(domainName: string, isBanned: boolean): Promise<void> {
    await this.websiteRepository.update(
      { domainName },
      { isDomainRoskomnadzorBanned: isBanned },
    );
  }
}
