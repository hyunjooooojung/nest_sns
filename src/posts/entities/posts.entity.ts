import { UsersModel } from "src/users/entities/users.entity";
import { Column, Entity, ManyToOne } from "typeorm";
import { BaseModel } from "src/common/entity/base.entity";
import { IsString } from "class-validator";

@Entity()
export class PostsModel extends BaseModel{
    @ManyToOne(()=> UsersModel, (user) => user.posts, {
        nullable: false,
        onDelete: "CASCADE",
    })
    author: UsersModel;
    
    @Column()
    @IsString({
        message: 'title은 string 타입이어야 합니다.'
    })
    title: string;

    @Column()
    @IsString({
        message: 'content은 string 타입이어야 합니다.'
    })
    content: string;
    
    @Column()
    likeCount: number;
    
    @Column()
    commentCount: number;
}