import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Tag} from "./enitities/tag.entity";
import {DeleteResult, Repository} from "typeorm";
import {CreateTagDto} from "./dto/create-tag.dto";
import {UpdateTagDto} from "./dto/update-tag.dto";
import {MonitoringService} from "../monitoring/monitoring.service";
import {AttachToTagDto} from "./dto/attach-to-tag.dto";
import {CreateMonitoringDto} from "../monitoring/dto/create-monitoring.dto";
import {Monitoring} from "../monitoring/entities/monitoring.entity";
import * as punycode from "punycode";
import {getExpiredDate} from "../common/helper";

@Injectable()
export class TagsService {
    constructor(@InjectRepository(Tag) private readonly tagsRepository: Repository<Tag>,
                private readonly monitoringService: MonitoringService) {
    }

    public getTags(): Promise<Tag[] | []> {
        return this.tagsRepository.find()
    }

    public getByName(name: string): Promise<Tag | undefined> {
        return this.tagsRepository
            .createQueryBuilder('tag')
            .where('tag.name = :name', { name })
            .leftJoinAndSelect('tag.domains', 'domains')
            .getOne()
    }

    public getById(id: string): Promise<Tag | undefined> {
        return this.tagsRepository
            .createQueryBuilder('tag')
            .where('tag.id = :id', { id })
            .leftJoinAndSelect('tag.domains', 'domains')
            .getOne()
    }

    public async createTag({ name, domainIds }: CreateTagDto):  Promise<Tag | undefined> {
        const isExistTag = await this.getByName(name)

        if (isExistTag) {
            return;
        }

        const domains = await Promise.all(domainIds.map((id) => this.monitoringService.getById(id)))
        const newTag = {name, domains }
        return this.tagsRepository.save(newTag)
    }

    public async attachToTag(tagId, { domainIds }: AttachToTagDto):  Promise<Tag | undefined> {
        const tag = await this.getById(tagId)

        if (!tag) {
            return;
        }

        const domains = await Promise.all(domainIds.map((id) => this.monitoringService.getById(id)))
        const updatedTag = { ...tag, domains: [ ...tag.domains, ...domains ]}
        return this.tagsRepository.save(updatedTag)
    }

    public async unpinFromTag(tagId, { domainIds }: AttachToTagDto):  Promise<Tag | undefined> {
        const tag = await this.getById(tagId)

        if (!tag) {
            return;
        }

        const filteredDomains = tag.domains.filter((monitoring) => !domainIds.includes(monitoring.id));

        return this.tagsRepository.save( { ...tag, domains: filteredDomains })
    }

    public async updateTag(tagId: string, { name }: UpdateTagDto): Promise<Tag | undefined> {
        const tag = await this.getById(tagId)
        if (!tag) {
            return;
        }

        const updatedTag = { ...tag, name }
        return this.tagsRepository.save(updatedTag)
    }

    public async deleteTag(tagId: string): Promise<DeleteResult> {
        const tag = await this.getById(tagId)
        if (!tag) {
            return;
        }
        await this.tagsRepository
            .createQueryBuilder()
            .relation(Tag, 'domains')
            .of(tag)
            .remove(tag.domains);

        return this.tagsRepository.delete(tagId)
    }

    public async addNewDomains({ domains, tag }: CreateMonitoringDto): Promise<Monitoring[] | undefined> {
        const monitoringDomains = await this.monitoringService.getAll()
        const filtered = domains.filter(name => !monitoringDomains.some(item => item.name ===  punycode.toASCII(name)));

        let currentTag = []
        if (Array.isArray(tag)) {
            if (tag.length > 0) {
                currentTag = await Promise.all(tag.map((id) => this.getById(id)))
            }
        } else if (tag) {
            let tagByName  = await this.getByName(tag)

            if (!tagByName) {
                tagByName = await this.tagsRepository.save({ name: tag })
            }

            currentTag.push(tagByName)
        }

        const updatedDomains = await Promise.all(filtered.map(async (d) =>
            ({ name: punycode.toASCII(d), expiredAt: await getExpiredDate(d), tags: currentTag }))) as Monitoring[]

        return this.monitoringService.saveDomains(updatedDomains);
    }
}