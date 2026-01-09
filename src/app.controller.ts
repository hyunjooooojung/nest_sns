// controller : 가장 먼저 요청을 받아서 해당하는 함수로 라우팅하는, 보내주는 역할을 하는 곳.

import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
