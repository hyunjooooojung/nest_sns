import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { RolesEnum } from "src/users/const/roles.const";
import { PostsService } from "../posts.service";
import { UsersModel } from "src/users/entity/users.entity";
import { Request } from "express";

@Injectable()
export class IsPostMineOrAdminGuard implements CanActivate {
    constructor(
        private readonly postService: PostsService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest() as Request & {user: UsersModel};

        const { user } = request;

        if(!user) {
            throw new UnauthorizedException(
                '사용자 정보를 가져올 수 없습니다.',
            )
        }

        /**
         * Admin 권한인 경우 bypass
         */
        if (user.role === RolesEnum.ADMIN) {
            return true;
        }

        const postId = request.params.postId;

        if (!postId || Array.isArray(postId)) {
            throw new BadRequestException(
                'postId가 parameter로 제공되어야 합니다.'
            );
        }

        const isOk = this.postService.isPostMine(
            user.id,
            parseInt(postId),
        );

        if(!isOk) {
            throw new ForbiddenException(
                '권한이 없습니다.'
            );
        }

        return true;
    }
}