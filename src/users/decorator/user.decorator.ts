import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';
import { UsersModel } from '../entity/users.entity';

export const User = createParamDecorator(
  (data: keyof UsersModel | undefined, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();

    const user = request.user as UsersModel;
    if (!user) {
      throw new InternalServerErrorException('Request에 user 정보가 없습니다.');
    }

    if (data) {
      return user[data];
    }

    return user;
  },
);
