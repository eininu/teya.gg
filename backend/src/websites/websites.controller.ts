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
  Res,
  StreamableFile,
  Header,
} from '@nestjs/common';
import { WebsitesService } from './websites.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import { CreateWebsiteDto } from './dto/create-website.dto';
import { Readable } from 'stream';

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

  @Delete('deleteSite/:siteName')
  deleteSite(@Param('siteName') siteName: string) {
    return this.websitesService.deleteSite(siteName);
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
}
