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
  async findAll(): Promise<Website[]> {
    return await this.websitesService.findAll();
  }

  @Post()
  async create(@Body('domainName') domainName: string): Promise<{
    success: boolean;
    message: string;
    website?: Website;
  }> {
    return await this.websitesService.create(domainName);
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number): Promise<{
    deleted: boolean;
    message: string;
  }> {
    return await this.websitesService.delete(id);
  }
}
