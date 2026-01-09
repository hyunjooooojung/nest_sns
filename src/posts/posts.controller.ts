import { Body, Controller, Get, Delete,Param, Patch, Post, Put } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';
import { PostsService } from './posts.service';

interface PostModel {
  id: number;
  author: string;
  title: string;
  content: string;
  likeCount: number;
  commentCount: number;
}

let posts: PostModel[] = [
  {
    id: 1,
    author: 'newjeans_official',
    title: '뉴진스 민지',
    content: '메이크업 고치고 있는 민지',
    likeCount: 1000,
    commentCount: 10000,
  },
  {
    id: 2,
    author: 'newjeans_official',
    title: '뉴진스 민지',
    content: '메이크업 고치고 있는 민지',
    likeCount: 1000,
    commentCount: 10000,
  },
]


@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  getPosts(): PostModel[] {
    return posts;
  }

  @Get(':id')
  getPost(@Param('id') id: string): PostModel | undefined {
    const post = posts.find(post => post.id === parseInt(id));
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    return post;
  }

  @Post()
  createPost(
    @Body('author') author: string, 
    @Body('title') title: string, 
    @Body('content') content: string,
    @Body('likeCount') likeCount: number = 0,
    @Body('commentCount') commentCount: number = 0,
  ): PostModel {
    const newPost: PostModel = {
      id: posts[posts.length - 1].id + 1,
      author: author,
      title: title,
      content: content,
      likeCount: likeCount,
      commentCount: commentCount,
    }
    posts.push(newPost);
    return newPost;
  }

  @Put(':id')
  updatePost(
    @Param('id') id: string,
    @Body('author') author: string,
    @Body('title') title: string,
    @Body('content') content: string,
  ): PostModel {
    const post = posts.find(post => post.id === parseInt(id));
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    post.author = author;
    post.title = title;
    post.content = content;
    
    posts.push(post);
    return post;
  }

  @Patch(':id')
  patchPost(
    @Param('id') id: string,
    @Body('author') author: string | undefined,
    @Body('title') title: string | undefined,
    @Body('content') content: string | undefined,
  ): PostModel {
    const post = posts.find(post => post.id === parseInt(id));
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    if (author) {
      post.author = author;
    }
    if (title) {
      post.title = title;
    }
    if (content) {
      post.content = content;
    }
    posts = posts.map(prevPost => prevPost.id === parseInt(id) ? post: prevPost);
    
    return post;
  }

  @Delete(':id')
  deletePost(@Param('id') id: string): void {
    const post = posts.find(post => post.id === parseInt(id));
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    posts = posts.filter(prevPost => prevPost.id !== parseInt(id));
    return;
  }
}
