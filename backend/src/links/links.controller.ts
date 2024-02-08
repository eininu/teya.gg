import {
    Body,
    Controller, Delete, Param, Patch,  UseInterceptors,
} from '@nestjs/common';
import {LinksService} from "./links.service";
import {DeleteResult} from "typeorm";
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
