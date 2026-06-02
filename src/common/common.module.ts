import { Module } from '@nestjs/common';
import { CommonService } from './common.service';
import { CommonController } from './common.controller';
import { MulterModule } from '@nestjs/platform-express';
import { extname } from 'path';
import { BadRequestException } from '@nestjs/common';
import * as multer from 'multer';
import { TEMP_DIRECTORY_PATH } from './const/path.const';
import { v4 as uuid } from 'uuid';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { TransactionInterceptor } from './interceptor/transaction.interceptor';
import { LogInterceptor } from './interceptor/log.interceptor';

@Module({
  imports: [
    MulterModule.register({
      limits: {
        fileSize: 1024 * 1024 * 10, // 10MB - byte단위
      },
      fileFilter: (req, file, callback) => {
        /**
         * callback(에러, boolean)
         *
         * 첫번째 파라미터는 에러가 있을 경우 에러 정보를 넣어준다.
         * 두번째 파라미터는 파일을 받을지 말지 boolean 값을 넣어준다.
         */
        const ext = extname(file.originalname);
        if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') {
          return callback(
            new BadRequestException('jpg, png, jpeg 파일만 업로드 가능합니다.'),
            false,
          );
        }
        return callback(null, true);
      },
      storage: multer.diskStorage({
        destination: function (req, file, callback) {
          callback(null, TEMP_DIRECTORY_PATH);
        },
        filename: function (req, file, callback) {
          callback(null, `${uuid()}${extname(file.originalname)}`);
        },
      }),
    }),
    AuthModule,
    UsersModule,
  ],
  controllers: [CommonController],
  providers: [CommonService, TransactionInterceptor, LogInterceptor],
  exports: [CommonService, TransactionInterceptor, LogInterceptor],
})
export class CommonModule {}
