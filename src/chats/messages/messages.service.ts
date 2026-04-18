import { CommonService } from "src/common/common.service";
import { MessagesModel } from "./entity/messages.entity";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindManyOptions, Repository } from "typeorm";
import { BasePaginationDto } from "src/common/dto/base-pagination.dto";
import { CreateMessageDto } from "./dto/create-messages.dto";

@Injectable()
export class ChatsMessagesService {
    constructor(
        @InjectRepository(MessagesModel)
        private readonly messagesRepository: Repository<MessagesModel>,
        private readonly commonService: CommonService,
    ){}

    async createMessage(
        dto: CreateMessageDto
    ): Promise<MessagesModel> {
        const message = await this.messagesRepository.save({
            chat: {
                id: dto.chatId,
            },
            author: {
                id: dto.authorId,
            },
            message: dto.message,
        });

        return message;
    }
    paginateMessages(
        dto: BasePaginationDto,
        overrideFindOptions: FindManyOptions<MessagesModel> = {},
    ){
        return this.commonService.paginate(
            dto,
            this.messagesRepository,
            overrideFindOptions,
            'messages',
        )
    }
}