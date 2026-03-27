import { Body, Controller, Get, Delete,Param, Patch, Post, Put } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsModel } from './entities/posts.entity';


@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  getPosts(): Promise<PostsModel[]> {
    return this.postsService.getAllPosts();
  }

  @Get(':id')
  getPost(@Param('id') id: string) {
    return this.postsService.getPostById(parseInt(id));
  }

  @Post()
  async createPost(
    @Body('authorId') authorId: number, 
    @Body('title') title: string, 
    @Body('content') content: string,
    @Body('likeCount') likeCount: number = 0,
    @Body('commentCount') commentCount: number = 0,
  ): Promise<PostsModel> {
    return await this.postsService.createPost(
      authorId, 
      title, 
      content, 
      likeCount, 
      commentCount,
    );
  }

  @Put(':id')
  updatePost(
    @Param('id') id: string,
    @Body('authorId') authorId: number,
    @Body('title') title: string,
    @Body('content') content: string,
  ) {
    return this.postsService.updatePost(
      parseInt(id), 
      authorId, 
      title, 
      content,
    );
  }

  @Patch(':id')
  patchPost(
    @Param('id') id: string,
    @Body('authorId') authorId: number | undefined,
    @Body('title') title: string | undefined,
    @Body('content') content: string | undefined,
  ) {
    return this.postsService.patchPost(
      parseInt(id), 
      authorId, 
      title, 
      content,
    );
  }

  @Delete(':id')
  async deletePost(@Param('id') id: string): Promise<void> {
    return this.postsService.deletePost(
      parseInt(id),
    );
  }
}
