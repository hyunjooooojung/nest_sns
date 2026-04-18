import { Controller, Get } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { PaginateChatDto } from './dto/paginate-chat.dto';
import { Query } from '@nestjs/common';
@Controller('chats')
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  @Get()
  paginateChats(
    @Query() dto: PaginateChatDto,
  ){
    return this.chatsService.paginateChats(dto);
  }
}
