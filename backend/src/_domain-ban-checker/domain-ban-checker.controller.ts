// import { Controller, Get, Logger } from '@nestjs/common';
// import { DomainBanCheckerService } from './domain-ban-checker.service';
//
// @Controller('domain-ban-checker')
// export class DomainBanCheckerController {
//   private readonly logger = new Logger(DomainBanCheckerController.name);
//
//   constructor(
//     private readonly domainBanCheckerService: DomainBanCheckerService,
//   ) {}
//
//   @Get('/run-cron-task')
//   async runCronLogic() {
//     this.logger.log('Starting cron logic execution');
//     try {
//       const websites = await this.domainBanCheckerService.getAllMineWebsites();
//       if (websites.length !== 0) {
//         const dataNeedsToBeUpdated =
//           await this.domainBanCheckerService.checkIfDataNeedsToBeUpdated(true);
//         if (dataNeedsToBeUpdated) {
//           await this.domainBanCheckerService.downloadAndSaveCsvData();
//           await this.domainBanCheckerService.saveLastCommitDate();
//           await this.domainBanCheckerService.checkRoskomnadzorBan();
//         }
//         this.logger.log('Cron logic executed successfully');
//       } else {
//         this.logger.log('No domains to check');
//       }
//       return { message: 'Cron logic executed successfully' };
//     } catch (error) {
//       this.logger.error('Error running cron logic', error);
//       throw error;
//     }
//   }
// }
