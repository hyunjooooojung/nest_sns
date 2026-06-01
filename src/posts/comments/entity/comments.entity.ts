import { IsString } from "class-validator";
import { BaseModel } from "src/common/entity/base.entity";
import { PostsModel } from "src/posts/entity/posts.entity";
import { UsersModel } from "src/users/entity/users.entity";
import { Column, Entity, ManyToOne } from "typeorm";

@Entity()
export class CommentsModel extends BaseModel{
    @ManyToOne(() => UsersModel, (user) => user.postComments, {
        nullable: false,
        onDelete: "CASCADE",
    })
    author: UsersModel;

    @ManyToOne(() => PostsModel, (post) => post.comments, {
        nullable: false,
        onDelete: "CASCADE",
    })
    post: PostsModel;

    @Column()
    @IsString()
    comment: string;

    @Column({
        default: 0,
    })
    likeCount: number;
}