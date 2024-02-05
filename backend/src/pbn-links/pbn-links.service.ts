import {Body, Injectable} from '@nestjs/common';
import { CreatePbnLinkDto } from './dto/create-pbn-link.dto';
import { UpdatePbnLinkDto } from './dto/update-pbn-link.dto';
import { InjectRepository } from '@nestjs/typeorm';
import {DeleteResult, Repository} from 'typeorm';
import { PbnLink } from './entities/pbn-link.entity';
import {PaginationData} from "../common/types/pagination.type";
import {GetPbnLinksQuery} from "./types/get-pbn-links.type";
import {CreateLinkDto} from "../links/dto/create-link.dto";
import {LinksService} from "../links/links.service";
import {Link} from "../links/entities/link.entity";
import {ImportJsonDto} from "./dto/import-json.dto";

@Injectable()
export class PbnLinksService {
  constructor(
    @InjectRepository(PbnLink)
    private pbnLinkRepository: Repository<PbnLink>,
    private readonly linksService: LinksService
  ) {}

  async findAll(): Promise<{ [key: string]: string[] }> {
    return;
    // const pbnLinks = await this.domainRepository.find();
    // const result = {};
    // pbnLinks.forEach((pbnLink) => {
    //   const link = JSON.stringify(pbnLink.websiteLinks);
    //   result[pbnLink.website] = pbnLink.websiteLinks;
    // });
    // return result;
  }


  public async getAll(query: GetPbnLinksQuery): Promise<PaginationData<PbnLink>> {
    const { limit, skip, value } = query

    const qb = this.pbnLinkRepository
        .createQueryBuilder('pbn-links')
        .leftJoinAndSelect('pbn-links.links', 'links')
        .take(limit)
        .skip(skip)

    if (value) {
      qb.andWhere('pbn-links.website LIKE :website', { website: `%${value}%` });
    }


    const [data, total] = await qb.getManyAndCount();
    return { data, total };
  }

  public getById(id: string): Promise<PbnLink | undefined> {
    return this.pbnLinkRepository.findOne({ where: { id }, relations: ['links'] })
  }

  public async  addNewWebsite(dto: CreatePbnLinkDto): Promise<PbnLink> {
    return this.pbnLinkRepository.save(dto)
  }

  public async createLink(id: string,dto: CreateLinkDto): Promise<Link | undefined> {
    const website = await this.getById(id)
    if (!website) {
      return;
    }

    const link = { ...dto, website }
    return this.linksService.save(link)
  }

  public async deleteWebsite(id: string): Promise<DeleteResult | void> {
    const website = await this.getById(id)

    if(!website) {
      return;
    }
    const { links } = website

    if(links && links.length > 0) {
      for (const link of links) {
        await this.linksService.deleteLink(link.id);
      }
    }

    return this.pbnLinkRepository.delete(id)
  }

  public async importJSON(dto: ImportJsonDto[]): Promise<PbnLink[]  | undefined> {
    await this.linksService.deleteAll()
    await this.pbnLinkRepository.delete({})

    const websites = await Promise.all(dto.map(async ({website}) => this.pbnLinkRepository.save({ website })))
    const linksObj = dto.reduce((acc, {website, links}) => ({ ...acc, [website]: links }), {})
    for (const wb of websites) {
      const links = linksObj[wb.website]

      if(links && links.length > 0) {
        const websiteLinks = links.map((l) => ({ ...l, website: wb}))
        await this.linksService.saveAll(websiteLinks)
      }
    }

    return websites
  }
}
