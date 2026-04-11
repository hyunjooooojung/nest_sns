import { PickType } from "@nestjs/mapped-types";
import { ImagesModel } from "src/common/entity/image.entity";

export class CreatePostImageDto extends PickType(ImagesModel, [
    'order',
    'type',
    'path',
    'post',
]) {}
