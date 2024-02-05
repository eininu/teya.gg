import {Global, Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Link} from "./entities/link.entity";
import {LinksController} from "./links.controller";
import {LinksService} from "./links.service";

@Global()
@Module({
    imports: [TypeOrmModule.forFeature([Link])],
    controllers: [LinksController],
    providers: [LinksService],
    exports: [LinksService]
})
export class LinksModule {}