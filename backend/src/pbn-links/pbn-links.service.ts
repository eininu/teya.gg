import { Injectable } from '@nestjs/common';
import { CreatePbnLinkDto } from './dto/create-pbn-link.dto';
import { UpdatePbnLinkDto } from './dto/update-pbn-link.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PbnLink } from './entities/pbn-link.entity';

@Injectable()
export class PbnLinksService {
  constructor(
    @InjectRepository(PbnLink)
    private domainRepository: Repository<PbnLink>,
  ) {}

  async findAll(): Promise<{ [key: string]: string[] }> {
    const pbnLinks = await this.domainRepository.find();
    const result = {};
    pbnLinks.forEach((pbnLink) => {
      const link = JSON.stringify(pbnLink.websiteLinks);
      result[pbnLink.website] = pbnLink.websiteLinks;
    });
    return result;
  }
}
