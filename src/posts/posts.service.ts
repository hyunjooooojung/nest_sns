import { Injectable } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { PostsModel } from './entities/posts.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersModel } from 'src/users/entities/users.entity';


@Injectable()
export class PostsService {
    constructor(
        @InjectRepository(PostsModel)
        private readonly postsRepository: Repository<PostsModel>
    ) {}

    async getAllPosts(): Promise<PostsModel[]> {
        return await this.postsRepository.find({
            relations: ['author'],
        });
    }

    async getPostById(id: number): Promise<PostsModel> {
        const post = await this.postsRepository.findOne({ 
            where: { id }, 
            relations: ['author'],
        });

        if (!post) {
            throw new NotFoundException('Post not found');
        }
        return post;
    }

    async createPost(
        authorId: number,
        title: string,
        content: string,
        likeCount?: number,
        commentCount?: number,
    ): Promise<PostsModel> {
        const post = this.postsRepository.create({
            author: { id: authorId },
            title,
            content,
            likeCount: likeCount ?? 0,
            commentCount: commentCount ?? 0,
        });
        return await this.postsRepository.save(post);
    }

    async updatePost(
        id: number,
        authorId: number,
        title: string,
        content: string,
    ): Promise<PostsModel> {
        const post = await this.postsRepository.findOne({ where: { id } });

        if (!post) {
        throw new NotFoundException('Post not found');
        }

        await this.postsRepository.update(id, {
            author: { id: authorId },
            title,
            content,
        });
        return post;
    }

    async patchPost(
        id: number,
        authorId: number | undefined,
        title: string | undefined,
        content: string | undefined,
    ): Promise<PostsModel> {
        const post = await this.postsRepository.findOne({ where: { id } });
        if (!post) {
            throw new NotFoundException('Post not found');
        }
        await this.postsRepository.update(id, { author: { id: authorId ?? post.author.id }, title, content });
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
