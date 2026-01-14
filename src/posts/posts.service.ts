import { Injectable } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { PostsModel } from './entities/posts.entity';
import { InjectRepository } from '@nestjs/typeorm';


@Injectable()
export class PostsService {
    constructor(
        @InjectRepository(PostsModel)
        private readonly postsRepository: Repository<PostsModel>
    ) {}

    async getAllPosts(): Promise<PostsModel[]> {
        return await this.postsRepository.find();
    }

    async getPostById(id: number): Promise<PostsModel> {
        const post = await this.postsRepository.findOne({ where: { id } });

        if (!post) {
            throw new NotFoundException('Post not found');
        }
        return post;
    }

    async createPost(
        author: string,
        title: string,
        content: string,
        likeCount: number,
        commentCount: number,
    ): Promise<PostsModel> {
        const newPost = this.postsRepository.create({
            author,
            title,
            content,
            likeCount,
            commentCount,
        });
        return this.postsRepository.save(newPost);
    }

    async updatePost(
        id: number,
        author: string,
        title: string,
        content: string,
    ): Promise<PostsModel> {
        const post = await this.postsRepository.findOne({ where: { id } });
        if (!post) {
        throw new NotFoundException('Post not found');
        }
        await this.postsRepository.update(id, { author, title, content });
        return post;
    }

    async patchPost(
        id: number,
        author: string | undefined,
        title: string | undefined,
        content: string | undefined,
    ): Promise<PostsModel> {
        const post = await this.postsRepository.findOne({ where: { id } });
        if (!post) {
            throw new NotFoundException('Post not found');
        }
        await this.postsRepository.update(id, { author, title, content });
        return post;
    }

    async deletePost(id: number): Promise<void> {
        const post = await this.postsRepository.findOne({ where: { id } });
        if (!post) {
        throw new NotFoundException('Post not found');
        }
        await this.postsRepository.delete(id);
    }
}
