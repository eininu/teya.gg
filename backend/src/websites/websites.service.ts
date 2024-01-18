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

  @Cron('0 */15 * * * *')
  async websitesBuild() {
    await this.triggerWebsitesBuild();
  }

  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  async megaBackup() {
    await this.uploadBackupToMega().then((res) => this.logger.log(res));
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async synchronizeDbWithFs() {
    await this.synchronizeDatabaseWithFileSystem();
  }

  async getSites(): Promise<Website[]> {
    await this.synchronizeDatabaseWithFileSystem();
    if (!this.hasInitialBuildBeenTriggered) {
      await this.triggerWebsitesBuild();
      this.hasInitialBuildBeenTriggered = true;
    }
    return await this.websiteRepository.find();
  }

  async createSite(
    siteName: string,
    zipFile?: Express.Multer.File,
  ): Promise<string> {
    const punycodeDomainName = punycode.toASCII(siteName);
    const sitePath = path.join(this.contentDir, punycodeDomainName);

    const existingWebsite = await this.websiteRepository.findOne({
      where: { domainName: punycodeDomainName },
    });
    if (existingWebsite) {
      throw new Error(
        `Website with domain name '${punycodeDomainName}' already exists.`,
      );
    }

    try {
      fs.mkdirSync(sitePath, { recursive: true });

      if (zipFile && zipFile.path) {
        const zip = new AdmZip(zipFile.path);
        zip.extractAllTo(sitePath, true);
        fs.unlinkSync(zipFile.path);
      } else {
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
{% include "_includes/links.njk" %}
</body>
</html>`,
        );
      }

      const website = this.websiteRepository.create({
        domainName: punycodeDomainName,
      });
      await this.websiteRepository.save(website);

      this.logger.log(`Site ${punycodeDomainName} created successfully`);
      await this.synchronizeDatabaseWithFileSystem();
      await this.triggerWebsitesBuild();
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
    if (!zipFile || !zipFile.path) {
      return `No zip file provided`;
    }

    const sitePath = path.join(this.contentDir);
    const backupPath = path.join(this.contentDir, '../uploads/backup.zip');

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

      for (const zipEntry of zipEntries) {
        if (zipEntry.isDirectory) {
          const siteName = zipEntry.entryName.split('/')[0];
          const punycodeDomainName = punycode.toASCII(siteName);

          const existingWebsite = await this.websiteRepository.findOne({
            where: { domainName: punycodeDomainName },
          });

          if (!existingWebsite) {
            const newWebsite = this.websiteRepository.create({
              domainName: punycodeDomainName,
            });
            await this.websiteRepository.save(newWebsite);
          }
        }
      }

      zip.extractAllTo(sitePath, true);
      restoreBackup = false;
      await fs.promises.unlink(zipFile.path);
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
        this.logger.log(`Backup deleted successfully`);
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

    try {
      const { Storage } = { ...mega };

      const storage = new Storage({ email: login, password: password });

      await storage.ready;

      const sitePath = path.join(this.contentDir);
      const backupPath = path.join(
        this.contentDir,
        '../uploads/mega-backup.zip',
      );
      //
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

      const file = await storage.upload(
        backupName + '.zip',
        this.createArchive(),
      ).complete;

      fs.unlinkSync(backupPath);

      this.logger.log('Backup uploaded successfully to MEGA');
      return 'Backup uploaded successfully to MEGA';
    } catch (error) {
      this.logger.error(`Error uploading backup to MEGA: ${error}`);
      return `Error uploading backup to MEGA`;
    }
  }

  async synchronizeDatabaseWithFileSystem() {
    const files = fs.readdirSync(this.contentDir);
    const websites = await this.websiteRepository.find();

    // Delete records from DB, which are not present in the file system
    for (const website of websites) {
      if (!files.includes(website.domainName)) {
        await this.websiteRepository.remove(website);
      }
    }

    // Add records to DB, which are present in the file system, but not in the DB
    for (const file of files) {
      if (!websites.some((website) => website.domainName === file)) {
        const newWebsite = this.websiteRepository.create({ domainName: file });
        await this.websiteRepository.save(newWebsite);
      }
    }
  }
}
