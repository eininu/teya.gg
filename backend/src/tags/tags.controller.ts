import {Body, Controller, Delete, Get, Param, Patch, Post} from "@nestjs/common";
import { TagsService } from "./tags.service";
import {Tag} from "./enitities/tag.entity";
import {UpdateTagDto} from "./dto/update-tag.dto";
import {DeleteResult} from "typeorm";
import {CreateTagDto} from "./dto/create-tag.dto";
import {AttachToTagDto} from "./dto/attach-to-tag.dto";
import {CreateMonitoringDto} from "../monitoring/dto/create-monitoring.dto";
import {Monitoring} from "../monitoring/entities/monitoring.entity";

@Controller('tags')
export class TagsController {
    constructor(private readonly tagsService: TagsService) {
    }

    @Get('/get-tags')
    public getTags():  Promise<Tag[] | []> {
        return this.tagsService.getTags()
    }

    @Post('/create-tag')
    public createTag( @Body() dto: CreateTagDto):  Promise<Tag | undefined> {
        return this.tagsService.createTag(dto)
    }

    @Post('add-new-domains')
    public addNewDomains(@Body() dto: CreateMonitoringDto): Promise<Monitoring[] | undefined> {
        return this.tagsService.addNewDomains(dto)
    }

    @Patch('/attach-to-tag/:tagId')
    public attachToTag(@Param('tagId') tagId: string, @Body() dto: AttachToTagDto):  Promise<Tag | undefined> {
        return this.tagsService.attachToTag(tagId, dto)
    }

    @Patch('/unpin-from-tag/:tagId')
    public unpinFromTag(@Param('tagId') tagId: string, @Body() dto: AttachToTagDto):  Promise<Tag | undefined> {
        return this.tagsService.unpinFromTag(tagId, dto)
    }

    @Patch('/update/:tagId')
    public updateTag(@Param('tagId') tagId: string, @Body() dto: UpdateTagDto):  Promise<Tag | undefined> {
        return this.tagsService.updateTag(tagId, dto)
    }

    @Delete('/delete/:tagId')
    public deleteTag(@Param('tagId') tagId: string):  Promise<DeleteResult> {
        return this.tagsService.deleteTag(tagId)
    }
}