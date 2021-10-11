import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

// @Controller('/myPath')
// @Controller({ path: '/myPath' })
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/bye')
  getBye() {
    return 'Bye!';
  }
}
