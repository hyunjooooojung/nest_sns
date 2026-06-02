import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ImagesModel } from 'src/common/entity/image.entity';
import { Repository } from 'typeorm';
import { CreatePostImageDto } from './dto/create-image.dto';
import path from 'path';
import { TEMP_DIRECTORY_PATH } from 'src/common/const/path.const';
import { promises } from 'fs';
import { join } from 'path';
import { POSTS_IMAGE_PATH } from 'src/common/const/path.const';
import { QueryRunner } from 'typeorm/browser';

@Injectable()
export class PostImagesService {
  constructor(
    @InjectRepository(ImagesModel)
    private readonly imagesRepository: Repository<ImagesModel>,
  ) {}

  getRepository(queryRunner?: QueryRunner) {
    return queryRunner
      ? queryRunner.manager.getRepository<ImagesModel>(ImagesModel)
      : this.imagesRepository;
  }

  async createPostImage(
    dto: CreatePostImageDto,
    queryRunner?: QueryRunner,
  ): Promise<ImagesModel> {
    const repository = this.getRepository(queryRunner);

    if (!dto.path?.trim()) {
      throw new BadRequestException('이미지 path는 필수입니다.');
    }

    const tempFilePath = path.join(TEMP_DIRECTORY_PATH, dto.path);

    try {
      await promises.access(tempFilePath);
    } catch {
      throw new NotFoundException('존재하지 않는 파일입니다.');
    }

    const fileName = path.basename(tempFilePath);
    // 새로 이동할 경로
    const newPath = join(POSTS_IMAGE_PATH, fileName);

    // ImagesModel 생성
    const image = await repository.save(
      repository.create({
        order: dto.order,
        type: dto.type,
        path: fileName,
        post: dto.post,
      }),
    );

    // 파일 이동
    await promises.rename(tempFilePath, newPath);

    return image;
  }
}
