import { Body, Controller, Get, Delete,Param, Patch, Post, ParseIntPipe, UseGuards, Query } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsModel } from './entities/posts.entity';
import { AccessTokenGuard } from 'src/auth/guard/bearer-token.guard';
import { User } from 'src/users/decorator/user.decorator';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PaginatePostDto } from './dto/paginate-post.dto';
import { UsersModel } from 'src/users/entities/users.entity';


@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  getPosts(
    @Query() query: PaginatePostDto,
  ): Promise<{data: PostsModel[]}> {
    return this.postsService.paginatePosts(query);
  }

  @Post('random')
  @UseGuards(AccessTokenGuard)
  async postPostsRandom(@User() user: UsersModel){
    return await this.postsService.generatePosts(user.id);
  }

  @Get(':id')
  getPost(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.getPostById(id);
  }

  @Post()
  @UseGuards(AccessTokenGuard)
  async createPost(
    @User('id') userId: number,
    @Body() body: CreatePostDto
    // @Body('title') title: string, 
    // @Body('content') content: string,
  ): Promise<PostsModel> {
    return await this.postsService.createPost(
      userId,
      body,
    );
  }

  @Patch(':id')
  updatePost(
    @Param('id') id: string,
    @Body('authorId') authorId: number,
    @Body() body: UpdatePostDto
    // @Body('title') title: string,
    // @Body('content') content: string,
  ) {
    return this.postsService.updatePost(
      parseInt(id), 
      authorId, 
      body,
    );
  }

  @Patch(':id')
  patchPost(
    @Param('id') id: string,
    @Body('authorId') authorId: number | undefined,
    @Body() body: UpdatePostDto
    // @Body('title') title: string | undefined,
    // @Body('content') content: string | undefined,
  ) {
    return this.postsService.patchPost(
      parseInt(id), 
      authorId, 
      body,
    );
  }

  @Delete(':id')
  async deletePost(@Param('id') id: string): Promise<void> {
    return this.postsService.deletePost(
      parseInt(id),
    );
  }
}
