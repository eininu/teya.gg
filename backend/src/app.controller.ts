import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/pbn-links')
  getPbnLinks(): {
    [key: string]: string[];
  } {
    return {
      'example1.com': ['test11.com', 'test22.com'],
      'example2.com': ['test33.com', 'test44.com'],
    };
  }
}
