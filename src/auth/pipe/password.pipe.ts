import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class PasswordPipe implements PipeTransform<string, string> {
  transform(value: any, metadata: ArgumentMetadata): string {
    const password = value.toString().trim();
    if (password.length < 8) {
      throw new BadRequestException('비밀번호는 8자 이상이어야 합니다.');
    }
    return password;
  }
}

@Injectable()
export class MaxLengthPipe implements PipeTransform<string, string> {
    constructor(private readonly length: number, private readonly subject: string) {
    }
    transform(value: any, metadata: ArgumentMetadata): string {
        if(value.toString().length > this.length) {
            throw new BadRequestException(`${this.subject}의 길이는 ${this.length}자 이하여야 합니다.`);
        }
        return value.toString().trim();
    }
}

@Injectable()
export class MinLengthPipe implements PipeTransform<string, string> {
    constructor(private readonly length: number, private readonly subject: string) {
    }
    transform(value: any, metadata: ArgumentMetadata): string {
        if(value.toString().length < this.length) {
            throw new BadRequestException(`${this.subject}의 길이는 ${this.length}자 이상이어야 합니다.`);
        }
        return value.toString().trim();
    }
}