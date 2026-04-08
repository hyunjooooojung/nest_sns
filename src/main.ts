import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 유효성 검사를 위한 파이프
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    transformOptions: {
      enableImplicitConversion: true,
    } // @Type(() => Number) 이 기능을 사용하지 않고도 자동으로 변환해준다.
  }));
  
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
