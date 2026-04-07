import { UsersModel } from "src/users/entities/users.entity";
import { Column, Entity, ManyToOne } from "typeorm";
import { BaseModel } from "src/common/entity/base.entity";
import { IsString } from "class-validator";
import { stringValidationMessage } from "src/common/validation-message/string-validation.message";

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
    
    @Column()
    likeCount: number;
    
    @Column()
    commentCount: number;
}