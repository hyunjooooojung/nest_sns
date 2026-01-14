import { Body, Controller, Get, Delete,Param, Patch, Post, Put } from '@nestjs/common';
import { PostsService } from './posts.service';


@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  getPosts(){
    return this.postsService.getAllPosts();
  }

  @Get(':id')
  getPost(@Param('id') id: string) {
    return this.postsService.getPostById(parseInt(id));
  }

  @Post()
  createPost(
    @Body('author') author: string, 
    @Body('title') title: string, 
    @Body('content') content: string,
    @Body('likeCount') likeCount: number = 0,
    @Body('commentCount') commentCount: number = 0,
  ) {
    return this.postsService.createPost(
      author, 
      title, 
      content, 
      likeCount, 
      commentCount,
    );
  }

  @Put(':id')
  updatePost(
    @Param('id') id: string,
    @Body('author') author: string,
    @Body('title') title: string,
    @Body('content') content: string,
  ) {
    return this.postsService.updatePost(
      parseInt(id), 
      author, 
      title, 
      content,
    );
  }

  @Patch(':id')
  patchPost(
    @Param('id') id: string,
    @Body('author') author: string | undefined,
    @Body('title') title: string | undefined,
    @Body('content') content: string | undefined,
  ) {
    return this.postsService.patchPost(
      parseInt(id), 
      author, 
      title, 
      content,
    );
  }

  @Delete(':id')
  deletePost(@Param('id') id: string): void {
    return this.postsService.deletePost(
      parseInt(id),
    );
  }
}
