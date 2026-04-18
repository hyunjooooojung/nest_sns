import { BasePaginationDto } from "src/common/dto/base-pagination.dto";
import { ChatsMessagesService } from "./messages.service";
import { Controller, Get, Param, ParseIntPipe, Query } from "@nestjs/common";

@Controller('chats/:cid/messages')
export class ChatsMessagesController {
    constructor(
        private readonly chatsMessagesService: ChatsMessagesService,
    ){}

    @Get()
    paginateMessages(
        @Param('cid', ParseIntPipe) id: number,
        @Query() dto: BasePaginationDto,
    ) {
        return this.chatsMessagesService.paginateMessages(
            dto,
            {
                where: {
                    chat: {
                        id: id,
                    }
                },
                relations: {
                    author: true,
                },
            }
        )
    }
}