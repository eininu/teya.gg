import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { PbnLinksService } from './pbn-links.service';
import { PbnLink } from './entities/pbn-link.entity';
import { CreatePbnLinkDto } from './dto/create-pbn-link.dto';
import { PaginationData } from '../common/types/pagination.type';
import { GetPbnLinksQuery } from './types/get-pbn-links.type';
import { CreateLinkDto } from '../links/dto/create-link.dto';
import { Link } from '../links/entities/link.entity';
import { DeleteResult } from 'typeorm';
import { ImportJsonDto } from './dto/import-json.dto';

@Controller('pbn-links')
export class PbnLinksController {
  constructor(private readonly pbnLinksService: PbnLinksService) {}

  @Get()
  async getDomains(): Promise<{ [key: string]: { [path: string]: string[] } }> {
    return this.pbnLinksService.findAll();
  }

  @Get('/get-all')
  public getAll(
    @Query() query: GetPbnLinksQuery,
  ): Promise<PaginationData<PbnLink>> {
    return this.pbnLinksService.getAll(query);
  }

  @Post('/add-new-website')
  public addNewWebsite(@Body() dto: CreatePbnLinkDto): Promise<PbnLink> {
    return this.pbnLinksService.addNewWebsite(dto);
  }

  @Post('/add-link/:id')
  public createLink(
    @Param('id') id: string,
    @Body() dto: CreateLinkDto,
  ): Promise<Link | undefined> {
    return this.pbnLinksService.createLink(id, dto);
  }

  @Post('/import-json')
  public importJSON(
    @Body() dto: ImportJsonDto[],
  ): Promise<PbnLink[] | undefined> {
    return this.pbnLinksService.importJSON(dto);
  }

  @Delete('/:id')
  public deleteLink(@Param('id') id: string): Promise<DeleteResult | void> {
    return this.pbnLinksService.deleteWebsite(id);
  }
}
