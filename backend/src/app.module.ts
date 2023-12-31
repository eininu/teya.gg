import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WebsitesModule } from './websites/websites.module';
import { ScheduleModule } from '@nestjs/schedule';
import { SchedulerService } from './scheduler/scheduler.service';
import { DomainBanCheckerModule } from './domain-ban-checker/domain-ban-checker.module';
import ormconfig from './../ormconfig';
@Module({
  imports: [
    TypeOrmModule.forRoot({ ...ormconfig.options }),
    WebsitesModule,
    ScheduleModule.forRoot(),
    DomainBanCheckerModule,
  ],
  controllers: [AppController],
  providers: [AppService, SchedulerService],
})
export class AppModule {}
