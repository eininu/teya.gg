import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WebsitesModule } from './websites/websites.module';
import { ScheduleModule } from '@nestjs/schedule';
import { SchedulerService } from './scheduler/scheduler.service';
import { DomainBanCheckerModule } from './domain-ban-checker/domain-ban-checker.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT, 10) || 5435,
      username: process.env.DB_USERNAME || 'test',
      password: process.env.DB_PASSWORD || 'test',
      database: process.env.DB_DATABASE || 'test',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    WebsitesModule,
    ScheduleModule.forRoot(),
    DomainBanCheckerModule,
  ],
  controllers: [AppController],
  providers: [AppService, SchedulerService],
})
export class AppModule {}
