import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { WebsitesService } from './websites.service';
import { Website } from './entities/website.entity';

@Controller('websites')
export class WebsitesController {
  constructor(private websitesService: WebsitesService) {}

  @Get()
  findAll(): Website[] {
    return this.websitesService.findAll();
  }

  @Post()
  create(@Body('domainName') domainName: string): {
    success: boolean;
    message: string;
    website?: Website;
  } {
    return this.websitesService.create(domainName);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number): {
    deleted: boolean;
    message: string;
  } {
    return this.websitesService.delete(id);
  }
}
