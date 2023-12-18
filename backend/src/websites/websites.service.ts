import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Website } from './entities/website.entity';
import * as punycode from 'punycode';

@Injectable()
export class WebsitesService {
  constructor(
    @InjectRepository(Website)
    private websiteRepository: Repository<Website>,
  ) {}

  async findAll(): Promise<Website[]> {
    return this.websiteRepository.find();
  }

  async create(domainName: string): Promise<{
    success: boolean;
    message: string;
    website?: Website;
  }> {
    const punycodeDomainName = punycode.toASCII(domainName);

    const existingWebsite = await this.websiteRepository.findOne({
      where: { domainName: punycodeDomainName },
    });

    if (existingWebsite) {
      return {
        success: false,
        message: `Website with domain name '${punycodeDomainName}' already exists.`,
      };
    }

    const website = this.websiteRepository.create({
      domainName: punycodeDomainName,
    });
    await this.websiteRepository.save(website);
    return { success: true, message: 'Website created successfully.', website };
  }

  async delete(id: number): Promise<{ deleted: boolean; message: string }> {
    const deleteResult = await this.websiteRepository.delete(id);

    if (deleteResult.affected > 0) {
      return {
        deleted: true,
        message: `Website with id ${id} has been deleted.`,
      };
    } else {
      return { deleted: false, message: `Website with id ${id} not found.` };
    }
  }
}
