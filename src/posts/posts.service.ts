import { Injectable } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { PostsModel } from './entities/posts.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersModel } from 'src/users/entities/users.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';


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
        postDto: CreatePostDto
    ): Promise<PostsModel> {
        const post = this.postsRepository.create({
            author: { id: authorId },
            ...postDto,
            likeCount: 0,
            commentCount: 0,
        });
        return await this.postsRepository.save(post);
    }

    async updatePost(
        id: number,
        authorId: number,
        body: UpdatePostDto
    ): Promise<PostsModel> {
        const post = await this.postsRepository.findOne({ where: { id } });

        if (!post) {
        throw new NotFoundException('Post not found');
        }

        await this.postsRepository.update(id, {
            author: { id: authorId },
            ...body,
        });
        return post;
    }

    async patchPost(
        id: number,
        authorId: number | undefined,
        body: UpdatePostDto
    ): Promise<PostsModel> {
        const post = await this.postsRepository.findOne({ where: { id } });
        if (!post) {
            throw new NotFoundException('Post not found');
        }
        await this.postsRepository.update(id, { author: { id: authorId ?? post.author.id }, ...body });
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
