// service: controller에서 처리할 비즈니스 로직을 정의하는 곳.

import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
