import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import axios from 'axios';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as AdmZip from 'adm-zip';
import * as mega from 'megajs';

@Injectable()
export class PbnService {
  private contentDir = './pbn/content/';
  private logger = new Logger('PbnService');

  @Cron('0 */15 * * * *')
  async pbnBuild() {
    await this.triggerPbnBuild().then((res) => this.logger.log(res));
  }

  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  async megaBackup() {
    await this.uploadBackupToMega().then((res) => this.logger.log(res));
  }

  getSites(): string[] {
    const directories = fs
      .readdirSync(this.contentDir, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);
    return directories;
  }

  createSite(siteName: string, zipFile?: Express.Multer.File): string {
    const sitePath = path.join(this.contentDir, siteName);
    fs.mkdirSync(sitePath, { recursive: true });

    if (zipFile && zipFile.path) {
      try {
        const zip = new AdmZip(zipFile.path);
        zip.extractAllTo(sitePath, true);

        this.logger.log(`Attempting to delete file: ${zipFile.path}`);
        fs.unlinkSync(zipFile.path);
      } catch (error) {
        this.logger.error(`Error processing zip file: ${error}`);
        // Логирование ошибки, если файл не удаляется
        if (fs.existsSync(zipFile.path)) {
          this.logger.error(`Failed to delete file: ${zipFile.path}`);
        }
        this.logger.error(`Error processing zip file for site ${siteName}`);
      }
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
      this.logger.log('No zip file provided, creating default index.html');
    }

    this.logger.log(`Site ${siteName} created successfully`);
    this.triggerPbnBuild().then((res) => this.logger.log(res));
    return `Site ${siteName} created successfully`;
  }

  deleteSite(siteName: string): string {
    const sitePath = path.join(this.contentDir, siteName);

    if (fs.existsSync(sitePath)) {
      fs.rmdirSync(sitePath, { recursive: true });
      this.triggerPbnBuild().then((res) => this.logger.log(res));
      this.logger.log(`Site ${siteName} deleted successfully`);
      return `Site ${siteName} deleted successfully`;
    } else {
      throw new NotFoundException(`Site ${siteName} does not exist`);
    }
  }

  // export pbn websites as zip archive
  createArchive(): Buffer {
    const contentDir = path.join(this.contentDir);
    const zip = new AdmZip();

    zip.addLocalFolder(contentDir);

    return zip.toBuffer();
  }

  async uploadBackup(zipFile: Express.Multer.File): Promise<string> {
    if (zipFile && zipFile.path) {
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
      if (zipFile && zipFile.path) {
        try {
          const zip = new AdmZip(zipFile.path);
          zip.extractAllTo(sitePath, true);
          restoreBackup = false;
          await fs.promises.unlink(zipFile.path);
          this.logger.log(`Backup uploaded successfully`);
        } catch (error) {
          this.logger.error(`Error processing zip file: ${error}`);
          if (fs.existsSync(zipFile.path)) {
            await fs.promises.unlink(zipFile.path);
            this.logger.error(`Failed to delete file: ${zipFile.path}`);
          }
          this.logger.error(`Error processing zip file for backup`);
        }
      } else {
        this.logger.log('No zip file provided');
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

      await this.triggerPbnBuild();
      return restoreBackup
        ? `Error occurred, restored from backup`
        : `Backup uploaded successfully`;
    } else {
      return `No zip file provided`;
    }
  }

  async triggerPbnBuild(): Promise<any> {
    try {
      const response = await axios.get('http://localhost:3001/build');
      return response.data;
    } catch (error) {
      this.logger.log(
        'Error triggering PBN build with localhost, trying to trigger with pbn service host',
      );
      try {
        const response = await axios.get('http://pbn:3001/build');
        return response.data;
      } catch (error) {
        return { message: 'Error triggering PBN build' };
      }

      // throw new Error('Error triggering PBN build');
    }
  }

  async uploadBackupToMega() {
    const login = process.env.MEGA_NZ_LOGIN;
    const password = process.env.MEGA_NZ_PASSWORD;

    if (!login || !password) {
      this.logger.error('MEGA credentials are missing');
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
}
