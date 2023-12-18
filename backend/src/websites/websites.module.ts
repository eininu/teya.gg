import { Module } from '@nestjs/common';
import { WebsitesService } from './websites.service';
import { WebsitesController } from './websites.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Website } from './entities/website.entity';

@Module({
  providers: [WebsitesService],
  controllers: [WebsitesController],
  imports: [TypeOrmModule.forFeature([Website])],
  exports: [WebsitesService],
})
export class WebsitesModule {}
