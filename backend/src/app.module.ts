import {MiddlewareConsumer, Module, RequestMethod} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { SchedulerService } from './scheduler/scheduler.service';
import { DomainBanCheckerModule } from './domain-ban-checker/domain-ban-checker.module';
import ormconfig from './../ormconfig';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PbnLinksModule } from './pbn-links/pbn-links.module';
import { WebsitesModule } from './websites/websites.module';
import {LinksModule} from "./links/links.module";
import {MonitoringModule} from "./monitoring/monitoring.module";
import {TagsModule} from "./tags/tags.module";
import {TelegramModule} from "./telegram-bot/telegram-bot.module";
import {TelegramSettingsModule} from "./telegram-settings/telegram-settings.module";


@Module({
  imports: [
    TypeOrmModule.forRoot({ ...ormconfig.options }),
    WebsitesModule,
    ScheduleModule.forRoot(),
    DomainBanCheckerModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'public'),
    }),
    TelegramModule,
    PbnLinksModule,
    LinksModule,
    MonitoringModule,
    TagsModule,
    TelegramSettingsModule
  ],
  controllers: [AppController],
  providers: [AppService, SchedulerService],
})
export class AppModule {}
