import {Global, Module} from '@nestjs/common';
import { WebsitesService } from './websites.service';
import { WebsitesController } from './websites.controller';
import { Website } from './entities/website.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Global()
@Module({
  providers: [WebsitesService],
  controllers: [WebsitesController],
  imports: [TypeOrmModule.forFeature([Website])],
  exports: [WebsitesService],
})
export class WebsitesModule {}
