import {
    Body,
    Controller, Delete, Get, Param, Patch, Query,
} from '@nestjs/common';
import {LinksService} from "./links.service";
import {GetPbnLinksQuery} from "../pbn-links/types/get-pbn-links.type";
import {PaginationData} from "../common/types/pagination.type";
import {PbnLink} from "../pbn-links/entities/pbn-link.entity";
import {DeleteResult} from "typeorm";
import {Website} from "../websites/entities/website.entity";
import {Link} from "./entities/link.entity";
import {UpdateLinkDto} from "./dto/update-link.dto";

@Controller('links')
export class LinksController {
    constructor(private readonly linksService: LinksService) {}

    @Patch('update/:id')
    public updateLink(@Param('id') id: string, @Body() dto: UpdateLinkDto): Promise<Link> {
        return this.linksService.updateLink(id, dto);
    }

    @Delete('/:id')
    public deleteLink(@Param('id') id: string): Promise<DeleteResult> {
        return this.linksService.deleteLink(id)
    }
}
