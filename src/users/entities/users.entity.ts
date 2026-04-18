import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { RolesEnum } from "../const/roles.const";
import { PostsModel } from "src/posts/entities/posts.entity";
import { BaseModel } from "src/common/entity/base.entity";
import { IsEmail, IsString, Length, ValidationArguments } from "class-validator";
import { lengthValidationMessage } from "src/common/validation-message/length-validation.message";
import { stringValidationMessage } from "src/common/validation-message/string-validation.message";
import { emailValidationMessage } from "src/common/validation-message/email-validation.message";
import { Exclude, Expose } from "class-transformer";
import { ChatsModel } from "src/chats/entity/chats.entity";


@Entity()
export class UsersModel extends BaseModel{
    @Column(
        {
            length: 20,
            unique: true,
        }
    )
    @IsString({
        message: stringValidationMessage,
    })
    @Length(1, 20, {
        message: lengthValidationMessage,
    })
    nickname: string;

    @Column({
        unique: true,
    })
    @IsString({
        message: stringValidationMessage,
    })
    @IsEmail({}, {
        message: emailValidationMessage,
    })
    email: string;

    @Column()
    @IsString({
        message: stringValidationMessage,
    })
    @Length(8, 20, {
        message: lengthValidationMessage,        
    })
    /**
     * Request
     * fe -> be
     * plain object(JSON) -> class instance (dto)
     * 
     * Response
     * be -> fe
     * class instance (dto) -> plain object (json)
     * 
     * toClassOnly -> class instance로 변환될 때만
     * toPlainOnly -> plain object로 변환될 때만
     */
    @Exclude({ toPlainOnly: true})
    password: string;

    @Expose() // exclude의 반대 기능 : 특정 필드를 포함시키고 싶을 때 사용
    get nicknameAndEmail(): string {
        return `${this.nickname}/${this.email}`;
    }

    @Column(
        {
            type: "enum",
            enum: Object.values(RolesEnum),
            default: RolesEnum.USER,
        }
    )
    role: RolesEnum;

    @OneToMany(()=> PostsModel, (post) => post.author)
    posts: PostsModel[];

    @ManyToMany(()=> ChatsModel, (chat) => chat.users)
    @JoinTable()
    chats: ChatsModel[];
}