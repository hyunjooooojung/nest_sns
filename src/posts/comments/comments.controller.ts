import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseFilters, UseGuards, UseInterceptors } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { LogInterceptor } from 'src/common/interceptor/log.interceptor';
import { HttpExceptionFilter } from 'src/common/exception-filter/http.exception-filter';
import { PaginationResult } from 'src/common/common.service';
import { CommentsModel } from './entity/comments.entity';
import { PaginateCommentsDto } from './dto/paginate-comment.dto';
import { AccessTokenGuard } from 'src/auth/guard/bearer-token.guard';
import { TransactionInterceptor } from 'src/common/interceptor/transaction.interceptor';
import { User } from 'src/users/decorator/user.decorator';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UsersModel } from 'src/users/entity/users.entity';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { IsPublic } from 'src/common/decorator/is-public.decorator';

@Controller('posts/:postId/comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {
  }

  @Get()
  @IsPublic()
  @UseInterceptors(LogInterceptor)
  @UseFilters(HttpExceptionFilter)
  getComments(
    @Param('postId', ParseIntPipe) postId: number, 
    @Query() query: PaginateCommentsDto,
  ): Promise<PaginationResult<CommentsModel>> {
    return this.commentsService.paginateComments(
      query, 
      postId
    );
  }

  @Get(':commentId')
  @IsPublic()
  @UseInterceptors(LogInterceptor)
  getComment(
    @Param('commentId', ParseIntPipe) commentId: number
  ) {
    return this.commentsService.getCommentById(commentId);
  }

  @Post()
  @UseInterceptors(LogInterceptor)
  createComment(
    @Param('postId', ParseIntPipe) postId: number,
    @User() user: UsersModel,
    @Body() body: CreateCommentDto,
  ): Promise<CommentsModel> {
    // 코멘트 생성
    return this.commentsService.createComment(
      body,
      postId,
      user,
    );
  }

  @Patch(':commentId')
  @UseInterceptors(LogInterceptor)
  patchComment(
    @Param('commentId', ParseIntPipe) commentId: number,
    @Body() body: UpdateCommentDto,
  ) {
    return this.commentsService.patchComment(
      body,
      commentId,
    )
  }

  @Delete(':commentId')
  @UseInterceptors(LogInterceptor)
  deleteComment(
    @Param('commentId', ParseIntPipe) commentId: number,
  ) {
    return this.commentsService.deleteComment(
      commentId,
    )
  }
}
