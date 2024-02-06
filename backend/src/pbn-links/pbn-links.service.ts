import { Injectable, Logger } from '@nestjs/common';
import { CreatePbnLinkDto } from './dto/create-pbn-link.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { PbnLink } from './entities/pbn-link.entity';
import { PaginationData } from '../common/types/pagination.type';
import { GetPbnLinksQuery } from './types/get-pbn-links.type';
import { CreateLinkDto } from '../links/dto/create-link.dto';
import { LinksService } from '../links/links.service';
import { Link } from '../links/entities/link.entity';
import { ImportJsonDto } from './dto/import-json.dto';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as fs from 'fs';
import * as path from 'path';
import * as mega from 'megajs';
import { getBackNameByTime } from '../common/helper';

const CONTENT_DIR = './_websites/content/';

@Injectable()
export class PbnLinksService {
  private readonly logger = new Logger(PbnLinksService.name);

  constructor(
    @InjectRepository(PbnLink)
    private pbnLinkRepository: Repository<PbnLink>,
    private readonly linksService: LinksService,
  ) {}

  public async findAll(
    query: Partial<GetPbnLinksQuery> = {},
  ): Promise<{ [key: string]: { [path: string]: string[] } }> {
    const { limit, skip, value } = query;

    const qb = this.pbnLinkRepository
      .createQueryBuilder('pbnLink')
      .leftJoinAndSelect('pbnLink.links', 'link');

    if (limit) {
      qb.take(limit);
    }

    if (skip) {
      qb.skip(skip);
    }

    if (value) {
      qb.andWhere('pbnLink.website LIKE :website', { website: `%${value}%` });
    }

    const data = await qb.getMany();

    const result = {};
    data.forEach((pbnLink) => {
      const websiteData = {};
      pbnLink.links.forEach((link) => {
        if (!websiteData[link.url]) {
          websiteData[link.url] = [];
        }
        websiteData[link.url].push(link.text);
      });
      result[pbnLink.website] = websiteData;
    });

    return result;
  }

  public async getAll(
    query: Partial<GetPbnLinksQuery>,
  ): Promise<PaginationData<PbnLink>> {
    const { limit, skip, value } = query;

    const qb = this.pbnLinkRepository
      .createQueryBuilder('pbn-links')
      .leftJoinAndSelect('pbn-links.links', 'links');

    if (limit) {
      qb.take(limit);
    }

    if (skip) {
      qb.skip(skip);
    }

    if (value) {
      qb.andWhere('pbn-links.website LIKE :website', { website: `%${value}%` });
    }

    const [data, total] = await qb.getManyAndCount();
    return { data, total };
  }

  public getById(id: string): Promise<PbnLink | undefined> {
    return this.pbnLinkRepository.findOne({
      where: { id },
      relations: ['links'],
    });
  }

  public async addNewWebsite(dto: CreatePbnLinkDto): Promise<PbnLink> {
    return this.pbnLinkRepository.save(dto);
  }

  public async createLink(
    id: string,
    dto: CreateLinkDto,
  ): Promise<Link | undefined> {
    const website = await this.getById(id);
    if (!website) {
      return;
    }

    const link = { ...dto, website };
    return this.linksService.save(link);
  }

  public async deleteWebsite(id: string): Promise<DeleteResult | void> {
    const website = await this.getById(id);

    if (!website) {
      return;
    }
    const { links } = website;

    if (links && links.length > 0) {
      for (const link of links) {
        await this.linksService.deleteLink(link.id);
      }
    }

    return this.pbnLinkRepository.delete(id);
  }

  public async importJSON(
    dto: ImportJsonDto[],
  ): Promise<PbnLink[] | undefined> {
    await this.linksService.deleteAll();
    await this.pbnLinkRepository.delete({});

    const websites = await Promise.all(
      dto.map(async ({ website }) => this.pbnLinkRepository.save({ website })),
    );
    const linksObj = dto.reduce(
      (acc, { website, links }) => ({ ...acc, [website]: links }),
      {},
    );
    for (const wb of websites) {
      const links = linksObj[wb.website];

      if (links && links.length > 0) {
        const websiteLinks = links.map((l) => ({ ...l, website: wb }));
        await this.linksService.saveAll(websiteLinks);
      }
    }

    return websites;
  }

  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  public async uploadPbnLinksBackupToMega() {
    const LOGIN = process.env.MEGA_NZ_LOGIN;
    const PASSWORD = process.env.MEGA_NZ_PASSWORD;
    const initTime = Date.now();

    if (!LOGIN || !PASSWORD) {
      this.logger.warn('MEGA credentials are missing');
      return;
    }

    const backupName = getBackNameByTime('pbn-links');
    const { Storage } = { ...mega };
    const storage = new Storage({ email: LOGIN, password: PASSWORD });

    await storage.ready;

    const sitePath = path.join(CONTENT_DIR);
    const backupPath = path.join(
      CONTENT_DIR,
      `../uploads/mega-pbn-links-backup-${initTime}.txt`,
    );

    const pbnLinks = await this.getAll({});

    if (pbnLinks.data.length === 0) {
      this.logger.warn('Pbn links is empty');
      return;
    }

    const websitesWithoutIds = pbnLinks.data.map((website) => {
      const { id, ...restWebsite } = website;

      if (restWebsite.links) {
        if (restWebsite.links.length > 0) {
          restWebsite.links = restWebsite.links.map(({ url, text }) => ({
            url,
            text,
          })) as Link[];
        }
      }
      return restWebsite;
    });

    try {
      if (fs.existsSync(sitePath)) {
        fs.writeFileSync(
          backupPath,
          JSON.stringify(websitesWithoutIds, null, 2),
          'utf8',
        );
        this.logger.log(`Backup created at: ${backupPath}, going to upload`);
      } else {
        throw new Error('Site path does not exist');
      }

      const fileStream = fs.createReadStream(backupPath);
      const uploadStream = storage.upload({
        name: backupName + '.txt',
        size: fs.statSync(backupPath).size,
      });

      fileStream.pipe(uploadStream);
      const file = await uploadStream.complete;
      this.logger.log('Backup uploaded successfully to MEGA');
      return 'Backup uploaded successfully to MEGA';
    } catch (error) {
      this.logger.error(`Error in backup process: ${error}`);
    } finally {
      if (fs.existsSync(backupPath)) {
        fs.unlinkSync(backupPath);
      }
    }
  }
}
