import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PbnLinksService } from './pbn-links.service';
import { CreatePbnLinkDto } from './dto/create-pbn-link.dto';
import { UpdatePbnLinkDto } from './dto/update-pbn-link.dto';

@Controller('pbn-links')
export class PbnLinksController {
  constructor(private readonly PbnLinksService: PbnLinksService) {}

  @Get()
  async getDomains(): Promise<{ [key: string]: string[] }> {
    return this.PbnLinksService.findAll();
  }
}
