import { Controller, Post, Body, Get, Delete, Param } from '@nestjs/common';
import { PbnService } from './pbn.service';

@Controller('pbn')
export class PbnController {
  constructor(private readonly pbnService: PbnService) {}

  @Get('sites')
  getSites() {
    return this.pbnService.getSites();
  }
  @Post('createSite')
  createSite(@Body('siteName') siteName: string) {
    return this.pbnService.createSite(siteName);
  }

  @Delete('deleteSite/:siteName')
  deleteSite(@Param('siteName') siteName: string) {
    return this.pbnService.deleteSite(siteName);
  }

  @Get('triggerBuild')
  async triggerBuild() {
    return await this.pbnService.triggerPbnBuild();
  }
}
