import {
  BadGatewayException,
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CommentsService } from '../comments.service';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { UsersModel } from 'src/users/entity/users.entity';
import { RolesEnum } from 'src/users/const/roles.const';

@Injectable()
export class IsCommentMineOrAdminGuard implements CanActivate {
  constructor(private readonly commentService: CommentsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const { user } = request;

    if (!user) {
      throw new UnauthorizedException('사용자 정보를 가져올 수 없습니다.');
    }

    /**
     * Admin 권한인 경우 bypass
     */
    if (user.role === RolesEnum.ADMIN) {
      return true;
    }

    const commentId = request.params.commentId;

    if (!commentId || Array.isArray(commentId)) {
      throw new BadRequestException(
        'commentId가 parameter로 제공되어야 합니다.',
      );
    }

    const isOk = this.commentService.isCommentMine(
      user.id,
      parseInt(commentId),
    );

    if (!isOk) {
      throw new ForbiddenException('권한이 없습니다.');
    }

    return true;
  }
}
