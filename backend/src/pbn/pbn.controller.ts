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
import { PbnService } from './pbn.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import { CreatePbnSiteDto } from './dto/create-pbn-site.dto';
import { Readable } from 'stream';

@Controller('pbn')
export class PbnController {
  constructor(private readonly pbnService: PbnService) {}

  @Get('sites')
  getSites() {
    return this.pbnService.getSites();
  }
  @Post('createSite')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './pbn/uploads',
        filename: (req, file, callback) => {
          const ext = path.extname(file.originalname);
          callback(null, `${file.fieldname}-${Date.now()}${ext}`);
        },
      }),
    }),
  )
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  createSite(
    @Body() createPbnSiteDto: CreatePbnSiteDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.pbnService.createSite(createPbnSiteDto.siteName, file);
  }

  @Delete('deleteSite/:siteName')
  deleteSite(@Param('siteName') siteName: string) {
    return this.pbnService.deleteSite(siteName);
  }

  @Get('triggerBuild')
  async triggerBuild() {
    return await this.pbnService.triggerPbnBuild();
  }

  // export pbn websites as zip file
  @Get('download')
  @Header('Content-Disposition', 'attachment; filename="content.zip"')
  downloadContent(): StreamableFile {
    const zipBuffer = this.pbnService.createArchive();
    const stream = Readable.from(zipBuffer);
    return new StreamableFile(stream);
  }
}
