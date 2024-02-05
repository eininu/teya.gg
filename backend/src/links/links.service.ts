import { Injectable} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {DeleteResult, Repository} from 'typeorm';
import {Link} from "./entities/link.entity";
import {CreateLinkDto} from "./dto/create-link.dto";
import {UpdateLinkDto} from "./dto/update-link.dto";
import {PbnLink} from "../pbn-links/entities/pbn-link.entity";

@Injectable()
export class LinksService {
    constructor(
        @InjectRepository(Link)
        private linksRepository: Repository<Link>,
    ) {}

    public getById(id: string): Promise<Link | undefined> {
        return this.linksRepository.findOne({ where: { id } })
    }

    public save(link: CreateLinkDto): Promise<Link> {
        return this.linksRepository.save(link)
    }

    public saveAll(links: Link[]): Promise<Link[]> {
        return this.linksRepository.save(links)
    }

    public deleteLink(id: string): Promise<DeleteResult> {
        return this.linksRepository.delete(id)
    }

    public deleteAll(): Promise<DeleteResult> {
        return this.linksRepository.delete({})
    }

    public async updateLink(id, dto: UpdateLinkDto): Promise<Link> {
        const link = await this.getById(id)
        const updated = { ...link, ...dto }
        return this.save(updated)
    }
}
