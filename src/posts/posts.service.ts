import { Injectable } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';
import { FindOptionsWhere, LessThan, MoreThan, Repository } from 'typeorm';
import { PostsModel } from './entities/posts.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PaginatePostDto } from './dto/paginate-post.dto';
import { HOST, PROTOCOL, PORT } from 'src/common/const/env.const';


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

    async paginatePosts(query: PaginatePostDto){
        if(query.page) {
            return this.pagePaginatePosts(query);
        } else {
            return this.cursorPaginatePosts(query);
        }
    }

    async pagePaginatePosts(query: PaginatePostDto){
        /**
         * Response
         * data: Data[]
         * total: number
         */
        const [posts, count] = await this.postsRepository.findAndCount({
            order: { createdAt: query.order__createdAt ?? 'ASC' },
            take: query.take,
            skip: query.take * (query.page! - 1),
        });
        return {
            data: posts,
            total: count,
        }
    }

    async cursorPaginatePosts(query: PaginatePostDto){

        const where: FindOptionsWhere<PostsModel> = {};
        if(query.where__id_less_than) {
            where.id = LessThan(query.where__id_less_than);
        }
        else if(query.where__id_more_than) {
            where.id = MoreThan(query.where__id_more_than);
        }

        const posts = await this.postsRepository.find({
            where,
            order: {
                createdAt: query.order__createdAt ?? 'ASC',
            },
            take: query.take,
        });

        /**
         * Response
         * 
         * data: Data[]
         * cursor: {
         *      after: 마지막 Data의 ID
         * },
         * count: 응답한 데이터의 갯수
         * next: 다음 요청을 할 때 사용할 URL
         */
        
        const lastPost = posts.length > 0 && posts.length === query.take ? posts[posts.length - 1] : null;
        const nextUrl = lastPost && new URL(`${PROTOCOL}://${HOST}:${PORT}/posts`);
        if (nextUrl) {
            /**
             * query 객체의 key값을 확인하면서
             * key값에 해당하는 value가 존재하면 param에 추가해준다.
             * 단, where__id_more_than 값은 lastPost의 마지막 값으로 넣어준다.
             */
            for(const key of Object.keys(query)) {
                if (query[key]) {
                    if(key !== 'where__id_more_than' && key !== 'where__id_less_than') {
                        nextUrl.searchParams.append(key, query[key].toString());
                    }
                }
            }

            let key: string | null = null;
            if(query.order__createdAt === 'ASC') {
                key = 'where__id_more_than';
            } else {
                key = 'where__id_less_than';
            }
            nextUrl.searchParams.append(key, lastPost?.id.toString() ?? '0');
        }

        return {
            data: posts,
            cursor: {
                after: lastPost?.id ?? null,
            },
            count: posts.length,
            next: lastPost ? nextUrl?.toString() ?? null : null,
        }
    }

    async generatePosts(userId: number){
        for(let i=0; i<100; i++){
            await this.createPost(userId, {
                title: `title ${i}`,
                content: `content ${i}`,
            });
        }
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
