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
      host: 'localhost', // replace with your Docker PostgreSQL container IP if not running on localhost
      port: 5435, // replace with your PostgreSQL running port
      username: 'test', // replace with your PostgreSQL username
      password: 'test', // replace with your PostgreSQL password
      database: 'test', // replace with your PostgreSQL database name
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
