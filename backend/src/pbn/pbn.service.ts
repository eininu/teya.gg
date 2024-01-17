import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import axios from 'axios';
import { Cron } from '@nestjs/schedule';
import * as AdmZip from 'adm-zip';

@Injectable()
export class PbnService {
  private contentDir = './pbn/content/';
  private logger = new Logger('PbnService');

  @Cron('0 */15 * * * *')
  async handleCron() {
    await this.triggerPbnBuild().then((res) => this.logger.log(res));
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
}
