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
import {TriggerBuildMiddleware} from "./middlewares/trigger-build.middleware";

@Module({
  imports: [
    TypeOrmModule.forRoot({ ...ormconfig.options }),
    WebsitesModule,
    ScheduleModule.forRoot(),
    DomainBanCheckerModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'public'),
    }),
    PbnLinksModule,
    LinksModule
    // WebsitesModule,
  ],
  controllers: [AppController],
  providers: [AppService, SchedulerService],
})
export class AppModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer.apply(TriggerBuildMiddleware).forRoutes(
        { path: 'links*', method: RequestMethod.POST },
        { path: 'links*', method: RequestMethod.PATCH },
        { path: 'links*', method: RequestMethod.DELETE },
        { path: 'pbn-links*', method: RequestMethod.POST },
        { path: 'pbn-links*', method: RequestMethod.PATCH },
        { path: 'pbn-links*', method: RequestMethod.DELETE },
    );
  }
}
