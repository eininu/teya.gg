import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { DomainBanCheckerService } from './domain-ban-checker.service';
import { WebsitesModule } from '../websites/websites.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LastCommitDate } from './entities/last-commit-date.entity';
import { BlockedDomain } from './entities/blocked-domain.entity';
import { Website } from '../websites/entities/website.entity';

@Module({
  imports: [
    HttpModule,
    WebsitesModule,
    TypeOrmModule.forFeature([LastCommitDate, BlockedDomain, Website]),
  ],
  providers: [DomainBanCheckerService],
  exports: [DomainBanCheckerService],
})
export class DomainBanCheckerModule {}
