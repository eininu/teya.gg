import { Module } from '@nestjs/common';
import { PbnService } from './pbn.service';
import { PbnController } from './pbn.controller';

@Module({
  providers: [PbnService],
  controllers: [PbnController],
  exports: [PbnService],
})
export class PbnModule {}
