import {
  Controller,
  Post,
  Body,
  Get,
  Delete,
  Param,
  UseInterceptors,
  UploadedFile,
  UsePipes,
  ValidationPipe,
  StreamableFile,
  Header, Patch,
} from '@nestjs/common';
import { WebsitesService } from './websites.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import { Readable } from 'stream';

import { CreateWebsiteDto } from './dto/create-website.dto';
import {Website} from "./entities/website.entity";

@Controller('websites')
export class WebsitesController {
  constructor(private readonly websitesService: WebsitesService) {}

  @Get()
  getSites() {
    return this.websitesService.getSites();
  }
  @Post('createSite')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './_websites/uploads',
        filename: (req, file, callback) => {
          const ext = path.extname(file.originalname);
          callback(null, `${file.fieldname}-${Date.now()}${ext}`);
        },
      }),
    }),
  )
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  createSite(
    @Body() createWebsiteDto: CreateWebsiteDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.websitesService.createSite(createWebsiteDto.siteName, file);
  }

  @Delete('deleteSite/:siteId')
  deleteSite(@Param('siteId') siteId: number) {
    return this.websitesService.deleteSite(siteId);
  }

  @Get('triggerBuild')
  async triggerBuild() {
    return await this.websitesService.triggerWebsitesBuild();
  }

  // export websites as zip file
  @Get('download')
  @Header('Content-Disposition', 'attachment; filename="content.zip"')
  downloadContent(): StreamableFile {
    const zipBuffer = this.websitesService.createArchive();
    const stream = Readable.from(zipBuffer);
    return new StreamableFile(stream);
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './_websites/uploads',
        filename: (req, file, callback) => {
          const ext = path.extname(file.originalname);
          callback(null, `${file.fieldname}-${Date.now()}${ext}`);
        },
      }),
    }),
  )
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  upload(
    // @Body('file') file: Express.Multer.File,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.websitesService.uploadBackup(file);
  }

  @Get('mega-backup')
  uploadBackupToMega() {
    return this.websitesService.uploadBackupToMega();
  }

  @Patch('update-all-dates')
  public updateAllDates(): Promise<Website[]> {
    return this.websitesService.updateAllDates();
  }

  @Patch('update-date/:id')
  public updatedExpiredDate(@Param('id') id: string): Promise<Website | undefined> {
    return this.websitesService.updatedExpiredDate(id);
  }

  @Patch('update/:id')
  public updateWebsite(@Param('id') id: string, @Body() dto: Partial<Website>): Promise<Website | undefined> {
    return this.websitesService.updateWebsite(id, dto);
  }
}
