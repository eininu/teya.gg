import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class SchedulerService {
  private readonly logger = new Logger(SchedulerService.name);

  // @Cron(CronExpression.EVERY_MINUTE)
  // async handleCron() {
  //   this.logger.log('Run a task according to a schedule.');
  // }
}
