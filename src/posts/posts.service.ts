import { Injectable } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';

export interface PostModel {
    id: number;
    author: string;
    title: string;
    content: string;
    likeCount: number;
    commentCount: number;
  }
  
  export let posts: PostModel[] = [
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

@Injectable()
export class PostsService {
    getAllPosts(): PostModel[] {
        return posts;
    }

    getPostById(id: number): PostModel {
        const post = posts.find(post => post.id === id);

        if (!post) {
            throw new NotFoundException('Post not found');
        }
        return post;
    }

    createPost(
        author: string,
        title: string,
        content: string,
        likeCount: number,
        commentCount: number,
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

    updatePost(
        id: number,
        author: string,
        title: string,
        content: string,
    ): PostModel {
        const post = posts.find(post => post.id === id);
        if (!post) {
        throw new NotFoundException('Post not found');
        }
        post.author = author;
        post.title = title;
        post.content = content;
        
        posts = posts.map(prevPost => prevPost.id === id ? post: prevPost);
        return post;
    }

    patchPost(
        id: number,
        author: string | undefined,
        title: string | undefined,
        content: string | undefined,
    ): PostModel {
        const post = posts.find(post => post.id === id);
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
        posts = posts.map(prevPost => prevPost.id === id ? post: prevPost);
        
        return post;
    }

    deletePost(id: number): void {
        const post = posts.find(post => post.id === id);
        if (!post) {
        throw new NotFoundException('Post not found');
        }
        posts = posts.filter(prevPost => prevPost.id !== id);
        return;
    }
}
