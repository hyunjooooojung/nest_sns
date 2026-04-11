import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsModule } from './posts/posts.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsModel } from './posts/entities/posts.entity';
import { UsersModel } from './users/entities/users.entity';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { CommonModule } from './common/common.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ENV_DB_HOST_KEY, ENV_DB_PORT_KEY, ENV_DB_USERNAME_KEY, ENV_DB_PASSWORD_KEY, ENV_DB_DATABASE_KEY } from './common/const/env-keys.const';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    PostsModule,
    TypeOrmModule.forRoot({
      type: 'postgres' as const,
      host: process.env[ENV_DB_HOST_KEY],
      port: parseInt(process.env[ENV_DB_PORT_KEY] ?? '5432') ?? 5432,
      username: process.env[ENV_DB_USERNAME_KEY],
      password: process.env[ENV_DB_PASSWORD_KEY],
      database: process.env[ENV_DB_DATABASE_KEY],
      entities: [
        PostsModel,
        UsersModel,
      ],
      synchronize: true, // development 환경에서만 사용, production 환경에서는 false로 설정
    }),
    UsersModule,
    AuthModule,
    CommonModule,
  ],
  controllers: [AppController],
  providers: [AppService, {
    provide: APP_INTERCEPTOR,
    useClass: ClassSerializerInterceptor,
  }],
})
export class AppModule {}

/**
   * serialization -> 직렬화 -> 현재 시스템에서 사용되는 (Nest JS) 데이터의 구조를 다른 시스템에서도
   *                          쉽게 사용할 수 있는 포맷으로 변환
   *                          -> class의 object에서 JSON 포맷으로 변환
   * deserialization -> 역직렬화 -> JSON 포맷을 다시 class의 object로 변환
   */