import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { BaseModel } from "./base.entity";
import { Column, Entity, ManyToOne } from "typeorm";
import { Transform } from "class-transformer";
import { join } from "path";
import { POST_PUBLIC_IMAGE_PATH } from "../const/path.const";
import { PostsModel } from "src/posts/entity/posts.entity";

export enum ImageTypeEnum {
    POST = 'POST_IMAGE',
    USER = 'USER_PROFILE_IMAGE',
}

@Entity()
export class ImagesModel extends BaseModel{
    @Column({
        default: 0,
        nullable: false,
    })
    @IsNumber()
    @IsOptional()
    order: number;

    @Column({
        enum: ImageTypeEnum,
    })
    @IsEnum(ImageTypeEnum)
    type: ImageTypeEnum;

    @Column()
    @IsString()
    @Transform(({value, obj}) => {
        if(obj.type === ImageTypeEnum.POST){
            return `/${join(POST_PUBLIC_IMAGE_PATH, value)}`
        } else{
            return value;
        }
    })
    path: string;

    @ManyToOne((type) => PostsModel, (post) => post.images)
    post?: PostsModel;
}