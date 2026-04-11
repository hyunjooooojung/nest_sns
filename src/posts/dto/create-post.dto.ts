import { PickType } from "@nestjs/mapped-types";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { PostsModel } from "../entities/posts.entity";

// export class CreatePostDto {
//     @IsString({
//         message: 'title은 string 타입이어야 합니다.'
//     })
//     title: string;

//     @IsString({
//         message: 'content은 string 타입이어야 합니다.'
//     })
//     content: string;
// }

/**
 * Pick, Omit, Partial -> Type 반환
 * PickType, OmitType, PartialType -> 값 반환
 */
export class CreatePostDto extends PickType(PostsModel, ['title', 'content']) {
    @IsString()
    @IsOptional()
    image?: string | null;
}