import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsModel } from './entity/posts.entity';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { CommonModule } from 'src/common/common.module';
import { ImagesModel } from 'src/common/entity/image.entity';
import { PostImagesService } from './image/images.service';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      PostsModel,
      ImagesModel,
    ]),
    AuthModule,
    UsersModule,
    CommonModule,
    
  ],
  controllers: [PostsController],
  providers: [PostsService, PostImagesService],
  exports: [PostsService]
})
export class PostsModule {}
