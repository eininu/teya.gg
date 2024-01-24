import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import axios from 'axios';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as AdmZip from 'adm-zip';
import * as mega from 'megajs';
import * as punycode from 'punycode';
import { InjectRepository } from '@nestjs/typeorm';
import { Website } from './entities/website.entity';
import { Repository } from 'typeorm';

const WHO_IS_API = 'https://api.whois7.ru/?q=';

@Injectable()
export class WebsitesService {
  constructor(
    @InjectRepository(Website)
    private websiteRepository: Repository<Website>,
  ) {}

  private contentDir = './_websites/content/';
  private logger = new Logger('WebsitesService');
  private hasInitialBuildBeenTriggered = false;
  private domainBuilderUrl =
    process.env.MY_ENVIRONMENT === 'Production' ||
    process.env.MY_ENVIRONMENT === 'Development'
      ? 'http://websites-builder:3001'
      : 'http://localhost:3001';
  private isSynchronizing = false;

  @Cron('0 */15 * * * *')
  async websitesBuild() {
    await this.triggerWebsitesBuild();
  }

  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  async megaBackup() {
    await this.uploadBackupToMega().then((res) => this.logger.log(res));
  }

  //// temporary disabled cauz will broke build in manual upload
  // @Cron(CronExpression.EVERY_MINUTE)
  // async synchronizeDbWithFs() {
  //   await this.synchronizeDatabaseWithFileSystem();
  // }

  public getById(id: number): Promise<Website | null> {
    return this.websiteRepository.findOne({ where: { id } });
  }

  async getSites(): Promise<Website[]> {
    if (!this.hasInitialBuildBeenTriggered) {
      await this.triggerWebsitesBuild();
      this.hasInitialBuildBeenTriggered = true;
    }

    await this.synchronizeDatabaseWithFileSystem();
    return await this.websiteRepository.find({
      order: {
        expiredAt: 'ASC',
      },
    });
  }

  async createSite(
    siteName: string,
    zipFile?: Express.Multer.File,
    processZip: boolean = true,
  ): Promise<string> {
    const punycodeDomainName = punycode.toASCII(siteName);
    const sitePath = path.join(this.contentDir, punycodeDomainName);

    const existingWebsite = await this.websiteRepository.findOne({
      where: { domainName: punycodeDomainName },
    });
    if (existingWebsite) {
      this.logger.warn(
        `Website with domain name '${punycodeDomainName}' already exists.`,
      );
    }

    try {
      fs.mkdirSync(sitePath, { recursive: true });

      if (processZip && zipFile && zipFile.path) {
        const zip = new AdmZip(zipFile.path);
        zip.extractAllTo(sitePath, true);
        fs.unlinkSync(zipFile.path);
      }

      if (processZip && !zipFile) {
        fs.writeFileSync(
          path.join(sitePath, 'index.html'),
          `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>${siteName}</title>
    <!--    <link rel="stylesheet" href="style.css">--><body>
<h1>${siteName}</h1>
<!-- replacehere000 -->
</body>
</html>`,
        );
      }

      if (!existingWebsite) {
        const website = this.websiteRepository.create({
          domainName: punycodeDomainName,
          expiredAt: await this.getExpiredDate(punycodeDomainName),
        });
        await this.websiteRepository.save(website);
      }

      this.logger.log(`Site ${punycodeDomainName} created successfully`);
      if (processZip) {
        await this.synchronizeDatabaseWithFileSystem();
        await this.triggerWebsitesBuild();
      }

      return `Site ${punycodeDomainName} created successfully`;
    } catch (error) {
      this.logger.error(`Error creating site: ${error}`);
      if (fs.existsSync(sitePath)) {
        fs.rmdirSync(sitePath, { recursive: true });
      }
      throw error;
    }
  }

  async deleteSite(siteId: number): Promise<string> {
    const existingWebsite = await this.websiteRepository.findOne({
      where: { id: siteId },
    });

    if (!existingWebsite) {
      throw new NotFoundException(
        `Site with ID ${siteId} does not exist in the database`,
      );
    }

    const sitePath = path.join(this.contentDir, existingWebsite.domainName);

    if (!fs.existsSync(sitePath)) {
      throw new NotFoundException(
        `Site ${existingWebsite.domainName} does not exist in the file system`,
      );
    }

    try {
      fs.rmdirSync(sitePath, { recursive: true });

      await this.websiteRepository.remove(existingWebsite);

      this.logger.log(
        `Site ${existingWebsite.domainName} deleted successfully`,
      );
      await this.synchronizeDatabaseWithFileSystem();
      await this.triggerWebsitesBuild();
      return `Site ${existingWebsite.domainName} deleted successfully`;
    } catch (error) {
      this.logger.error(`Error deleting site: ${error}`);
      throw error;
    }
  }

  // export websites as zip archive
  createArchive(): Buffer {
    const contentDir = path.join(this.contentDir);
    const zip = new AdmZip();

    zip.addLocalFolder(contentDir);

    return zip.toBuffer();
  }

  async uploadBackup(zipFile: Express.Multer.File): Promise<string> {
    const initTime = Date.now();

    if (!zipFile || !zipFile.path) {
      return `No zip file provided`;
    }

    const sitePath = path.join(this.contentDir);
    const backupPath = path.join(
      this.contentDir,
      `../uploads/backup-${initTime}.zip`,
    );

    if (fs.existsSync(sitePath)) {
      try {
        const zip = new AdmZip();
        zip.addLocalFolder(sitePath);
        zip.writeZip(backupPath);
        this.logger.log(`Backup created at: ${backupPath}`);
      } catch (error) {
        this.logger.error(`Error creating backup: ${error}`);
        return `Error creating backup`;
      }
    }

    try {
      const files = await fs.promises.readdir(sitePath);
      for (const file of files) {
        const fullPath = path.join(sitePath, file);
        const stat = await fs.promises.stat(fullPath);
        if (stat.isDirectory()) {
          await fs.promises.rm(fullPath, { recursive: true, force: true });
        } else {
          await fs.promises.unlink(fullPath);
        }
      }
    } catch (error) {
      this.logger.error(`Error clearing directory: ${error}`);
      return `Error clearing directory`;
    }

    await fs.promises.mkdir(sitePath, { recursive: true });

    let restoreBackup = true;
    try {
      const zip = new AdmZip(zipFile.path);
      const zipEntries = zip.getEntries();
      const processedRootFolders = new Set();

      for (const zipEntry of zipEntries) {
        if (zipEntry.isDirectory) {
          const siteName = zipEntry.entryName.split('/')[0];

          // Check if the root folder has already been processed
          if (!processedRootFolders.has(siteName)) {
            processedRootFolders.add(siteName);

            const punycodeDomainName = punycode.toASCII(siteName);

            try {
              await this.createSite(siteName, null, false);
              this.logger.log(
                `Created new website from uploading backup: ${punycodeDomainName}`,
              );
            } catch (error) {
              this.logger.error(`Error creating website: ${error}`);
            }
          }
        }
      }

      zip.extractAllTo(sitePath, true);
      restoreBackup = false;
      await fs.promises.unlink(zipFile.path);
      await this.synchronizeDatabaseWithFileSystem();
      await this.triggerWebsitesBuild();
      this.logger.log(`Backup uploaded successfully`);
    } catch (error) {
      this.logger.error(`Error processing zip file: ${error}`);
      if (fs.existsSync(zipFile.path)) {
        await fs.promises.unlink(zipFile.path);
      }
    }

    if (restoreBackup && fs.existsSync(backupPath)) {
      try {
        await fs.promises.rm(sitePath, { recursive: true, force: true });
        const zip = new AdmZip(backupPath);
        zip.extractAllTo(sitePath, true);
        this.logger.log(`Restored from backup`);
      } catch (error) {
        this.logger.error(`Error restoring from backup: ${error}`);
      }
    }

    if (!restoreBackup && fs.existsSync(backupPath)) {
      try {
        await fs.promises.unlink(backupPath);
        this.logger.log(`Original backup deleted successfully`);
      } catch (error) {
        this.logger.error(`Error deleting backup: ${error}`);
      }
    }

    await this.synchronizeDatabaseWithFileSystem();
    await this.triggerWebsitesBuild();
    return restoreBackup
      ? `Error occurred, restored from backup`
      : `Backup uploaded successfully`;
  }

  async triggerWebsitesBuild(): Promise<any> {
    try {
      const response = await axios.get(`${this.domainBuilderUrl}/build`);
      this.logger.log(
        `Build triggered successfully with URL: ${this.domainBuilderUrl}`,
      );
      return response.data;
    } catch (error) {
      this.logger.error(
        `Error triggering websites build with URL: ${this.domainBuilderUrl}`,
      );
      this.logger.error(error);
    }
  }

  async uploadBackupToMega() {
    const initTime = Date.now();
    const login = process.env.MEGA_NZ_LOGIN;
    const password = process.env.MEGA_NZ_PASSWORD;

    if (!login || !password) {
      this.logger.warn('MEGA credentials are missing');
      return;
    }

    const currentDate = new Date();
    const backupName = `[${
      process.env.MY_ENVIRONMENT
    }] backup-${currentDate.getFullYear()}-${
      currentDate.getMonth() + 1
    }-${currentDate.getDate()}-${currentDate.getHours()}${currentDate.getMinutes()}`;
    const { Storage } = { ...mega };
    const storage = new Storage({ email: login, password: password });

    await storage.ready;

    const sitePath = path.join(this.contentDir);
    const backupPath = path.join(
      this.contentDir,
      `../uploads/mega-backup-${initTime}.zip`,
    );

    try {
      if (fs.existsSync(sitePath)) {
        const zip = new AdmZip();
        zip.addLocalFolder(sitePath);
        zip.writeZip(backupPath);
        this.logger.log(`Backup created at: ${backupPath}, going to upload`);
      } else {
        throw new Error('Site path does not exist');
      }

      const fileStream = fs.createReadStream(backupPath);
      const uploadStream = storage.upload({
        name: backupName + '.zip',
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

  async synchronizeDatabaseWithFileSystem() {
    this.logger.log('[Sync] Starting synchronization...');

    if (this.isSynchronizing) {
      this.logger.warn('[Sync] Synchronization is already in progress');
      return;
    }

    this.isSynchronizing = true;

    try {
      if (!fs.existsSync(this.contentDir)) {
        fs.mkdirSync(this.contentDir, { recursive: true });
      }

      let items = fs.readdirSync(this.contentDir);

      // Rename directories to punycode
      for (const item of items) {
        const fullPath = path.join(this.contentDir, item);
        if (fs.lstatSync(fullPath).isDirectory()) {
          const punycodeName = punycode.toASCII(item);
          if (punycodeName !== item) {
            const punycodePath = path.join(this.contentDir, punycodeName);
            fs.renameSync(fullPath, punycodePath);
            this.logger.log(`[Sync] Renamed ${item} to ${punycodeName}`);
          }
        }
      }

      // Update items list
      items = fs.readdirSync(this.contentDir);
      const directories = items.filter((item) =>
        fs.lstatSync(path.join(this.contentDir, item)).isDirectory(),
      );

      // Remove websites that don't exist in the file system
      let websites = await this.websiteRepository.find();

      for (const website of websites) {
        if (!directories.includes(website.domainName)) {
          await this.websiteRepository.remove(website);
        }
      }

      websites = await this.websiteRepository.find();

      for (const directory of directories) {
        if (!websites.some((website) => website.domainName === directory)) {
          await this.createSite(directory, null, false);
        }
      }
    } catch (error) {
      this.logger.error(
        `[Sync] Error synchronizing database with file system: ${error}`,
      );
    } finally {
      this.logger.log('[Sync] Synchronization completed');
      this.isSynchronizing = false;
    }
  }

  public async updateWebsite(
    id: string,
    dto: Partial<Website>,
  ): Promise<Website | undefined> {
    const website = await this.getById(+id);

    if (!website) {
      return;
    }

    const updated = { ...website, ...dto };
    return this.websiteRepository.save(updated);
  }

  public async updateAllDates(): Promise<Website[]> {
    const websites = await this.getSites();

    if (websites.length === 0 || !websites) {
      return;
    }

    const res = await Promise.all(
      websites.map(async (s) => ({
        ...s,
        expiredAt: await this.getExpiredDate(s.domainName),
      })),
    );

    return this.websiteRepository.save(res);
  }

  public async updatedExpiredDate(id: string): Promise<Website | undefined> {
    const website = await this.getById(+id);

    if (!website) {
      return;
    }

    const res = {
      ...website,
      expiredAt: await this.getExpiredDate(website.domainName),
    };
    return this.websiteRepository.save(res);
  }

  private async getExpiredDate(domainName: string) {
    const { data } = await axios.get(`${WHO_IS_API}${domainName}`);
    const expiredAt = data?.expires;
    return expiredAt ? new Date(expiredAt * 1000) : null;
  }
}
