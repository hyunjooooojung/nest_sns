import { Body, Controller, Get, Delete,Param, Patch, Post, ParseIntPipe, UseGuards, Query, UseInterceptors, UploadedFile, InternalServerErrorException, UseFilters, BadRequestException } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsModel } from './entity/posts.entity';
import { AccessTokenGuard } from 'src/auth/guard/bearer-token.guard';
import { User } from 'src/users/decorator/user.decorator';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PaginatePostDto } from './dto/paginate-post.dto';
import { PaginationResult } from 'src/common/common.service';
import { ImageTypeEnum } from 'src/common/entity/image.entity';
import { DataSource } from 'typeorm';
import { PostImagesService } from './image/images.service';
import { LogInterceptor } from 'src/common/interceptor/log.interceptor';
import { TransactionInterceptor } from 'src/common/interceptor/transaction.interceptor';
import { QueryRunner } from 'src/common/decorator/query-runner.decorator';
import type { QueryRunner as QR } from 'typeorm';
import { HttpExceptionFilter } from 'src/common/exception-filter/http.exception-filter';
import { Roles } from 'src/users/decorator/roles.decorator';
import { RolesEnum } from 'src/users/const/roles.const';
import { IsPublic } from 'src/common/decorator/is-public.decorator';


@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly dataSource: DataSource,
    private readonly postImagesService: PostImagesService,
  ) {}

  @Get()
  @IsPublic()
  @UseInterceptors(LogInterceptor)
  @UseFilters(HttpExceptionFilter)
  getPosts(
    @Query() query: PaginatePostDto,
  ): Promise<PaginationResult<PostsModel>> {
    return this.postsService.paginatePosts(query);
  }

  @Get(':id')
  @IsPublic()
  @UseInterceptors(LogInterceptor)
  getPost(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.getPostById(id);
  }

  @Post()
  @UseInterceptors(TransactionInterceptor)
  async createPost(
    @User('id') userId: number,
    @Body() body: CreatePostDto,
    @QueryRunner() qr: QR,
  ): Promise<PostsModel> {
    // 게시글 생성
    const post = await this.postsService.createPost(
      userId,
      body,
      qr,
    );

    // 이미지 업로드
    for(let i = 0; i < body.images.length; i++){
      await this.postImagesService.createPostImage({
        post,
        order: i,
        type: ImageTypeEnum.POST,
        path: body.images[i],
      }, qr);
    };
    return this.postsService.getPostById(post.id, qr);
  }

  @Patch(':id')
  updatePost(
    @Param('id') id: number,
    @Body('authorId') authorId: number,
    @Body() body: UpdatePostDto
    // @Body('title') title: string,
    // @Body('content') content: string,
  ) {
    return this.postsService.updatePost(
      id, 
      authorId, 
      body,
    );
  }

  @Patch(':id')
  patchPost(
    @Param('id', ParseIntPipe) id: number,
    @Body('authorId') authorId: number | undefined,
    @Body() body: UpdatePostDto
    // @Body('title') title: string | undefined,
    // @Body('content') content: string | undefined,
  ) {
    return this.postsService.patchPost(
      id,
      authorId, 
      body,
    );
  }

  @Delete(':id')
  @Roles(RolesEnum.ADMIN)
  async deletePost(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.postsService.deletePost(
      id,
    );
  }
}
