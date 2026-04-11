import { UsersModel } from "src/users/entities/users.entity";
import { Column, Entity, ManyToOne } from "typeorm";
import { BaseModel } from "src/common/entity/base.entity";
import { IsString } from "class-validator";
import { stringValidationMessage } from "src/common/validation-message/string-validation.message";
import { Transform } from "class-transformer";
import { join } from "path";
import { POST_PUBLIC_IMAGE_PATH } from "src/common/const/path.const";

@Entity()
export class PostsModel extends BaseModel{
    @ManyToOne(()=> UsersModel, (user) => user.posts, {
        nullable: false,
        onDelete: "CASCADE",
    })
    author: UsersModel;
    
    @Column()
    @IsString({
        message: stringValidationMessage,
    })
    title: string;

    @Column()
    @IsString({
        message: stringValidationMessage,
    })
    content: string;
    
    @Column({ type: 'text', nullable: true })
    @Transform(({ value }) => value ? `/${join(POST_PUBLIC_IMAGE_PATH, value)}` : null)
    image: string | null;

    @Column()
    likeCount: number;
    
    @Column()
    commentCount: number;
}