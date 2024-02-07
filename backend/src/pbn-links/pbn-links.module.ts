import {Global, Module} from '@nestjs/common';
import { PbnLinksService } from './pbn-links.service';
import { PbnLinksController } from './pbn-links.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PbnLink } from './entities/pbn-link.entity';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([PbnLink])],
  controllers: [PbnLinksController],
  providers: [PbnLinksService],
  exports: [PbnLinksService],
})
export class PbnLinksModule {}
