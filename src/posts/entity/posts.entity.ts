import { UsersModel } from "src/users/entity/users.entity";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { BaseModel } from "src/common/entity/base.entity";
import { IsString } from "class-validator";
import { stringValidationMessage } from "src/common/validation-message/string-validation.message";
import { ImagesModel } from "src/common/entity/image.entity";
import { CommentsModel } from "../comments/entity/comments.entity";

@Entity()
export class PostsModel extends BaseModel{
    @ManyToOne(()=> UsersModel, (user) => user.posts, {
        nullable: false,
        onDelete: "CASCADE",
    })
    author: UsersModel;
    
    @OneToMany((type)=> ImagesModel, (image) => image.post, {
        nullable: true,
        onDelete: "CASCADE",
    })
    images: ImagesModel[];

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

    @Column()
    likeCount: number;
    
    @Column()
    commentCount: number;

    @OneToMany(()=> CommentsModel, (comment) => comment.author)
    comments: CommentsModel[];
}