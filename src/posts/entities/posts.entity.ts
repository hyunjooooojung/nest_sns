import { UsersModel } from "src/users/entities/users.entity";
import { Column, Entity, ManyToOne } from "typeorm";
import { BaseModel } from "src/common/entity/base.entity";

@Entity()
export class PostsModel extends BaseModel{
    @ManyToOne(()=> UsersModel, (user) => user.posts, {
        nullable: false,
        onDelete: "CASCADE",
    })
    author: UsersModel;
    
    @Column()
    title: string;
    
    @Column()
    content: string;
    
    @Column()
    likeCount: number;
    
    @Column()
    commentCount: number;
}