import { Global, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Tag } from "./enitities/tag.entity";
import { TagsController } from "./tags.controller";
import { TagsService } from "./tags.service";

@Global()
@Module({
    imports: [TypeOrmModule.forFeature([Tag])],
    controllers: [TagsController],
    providers: [TagsService],
    exports: [TagsService]
})
export class TagsModule {}