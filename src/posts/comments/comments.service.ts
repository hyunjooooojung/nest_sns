import { Injectable, NotFoundException } from '@nestjs/common';
import { CommentsModel } from './entity/comments.entity';
import { PaginateCommentsDto } from './dto/paginate-comment.dto';
import { CommonService, PaginationResult } from 'src/common/common.service';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryRunner, Repository } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UsersModel } from 'src/users/entity/users.entity';
import { DEFAULT_COMMENT_FIND_OPTIONS } from './const/default-comment-find-options.const';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(CommentsModel)
    private readonly commentsRepository: Repository<CommentsModel>,
    private readonly commonService: CommonService,
  ) {}

  getRepository(qr?: QueryRunner) {
    return qr
      ? qr.manager.getRepository<CommentsModel>(CommentsModel)
      : this.commentsRepository;
  }

  async paginateComments(
    dto: PaginateCommentsDto,
    postId: number,
  ): Promise<PaginationResult<CommentsModel>> {
    return await this.commonService.paginate(
      dto,
      this.commentsRepository,
      // overrideFindOptions
      {
        ...DEFAULT_COMMENT_FIND_OPTIONS,
      },
      `posts/${postId}/comments`,
    );
  }

  async getCommentById(id: number): Promise<CommentsModel> {
    const comment = await this.commentsRepository.findOne({
      where: { id },
      ...DEFAULT_COMMENT_FIND_OPTIONS,
    });

    if (!comment) {
      throw new NotFoundException(`id: ${id} Comment는 존재하지 않습니다.`);
    }
    return comment;
  }

  async createComment(
    dto: CreateCommentDto,
    postId: number,
    author: UsersModel,
    qr?: QueryRunner,
  ) {
    const repository = this.getRepository(qr);

    return repository.save({
      ...dto,
      post: {
        id: postId,
      },
      author,
    });
  }

  async patchComment(dto: UpdateCommentDto, commentId: number) {
    const comment = await this.commentsRepository.findOne({
      where: {
        id: commentId,
      },
    });

    if (!comment) {
      throw new NotFoundException(
        `id: ${commentId} Comment는 존재하지 않습니다.`,
      );
    }

    const prevComment = await this.commentsRepository.preload({
      id: commentId,
      ...dto,
    });

    if (!prevComment) {
      throw new NotFoundException(
        `id: ${commentId} Comment는 존재하지 않습니다.`,
      );
    }

    const newComment = await this.commentsRepository.save(prevComment);

    return newComment;
  }

  async deleteComment(commentId: number, qr?: QueryRunner) {
    const repository = this.getRepository(qr);

    const comment = await repository.findOne({
      where: {
        id: commentId,
      },
    });

    if (!comment) {
      throw new NotFoundException(
        `id: ${commentId} Comment는 존재하지 않습니다.`,
      );
    }

    await repository.delete(commentId);
  }

  async isCommentMine(userId: number, commentId: number) {
    return this.commentsRepository.exists({
      where: {
        id: commentId,
        author: {
          id: userId,
        },
      },
      relations: {
        author: true,
      },
    });
  }
}
