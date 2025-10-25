import { Body, Controller, Get, Param, Req, RequestMapping } from "@nestjs/common";
import { ChatService } from "./chat.service";
import { ObjectId } from "mongodb";
import { ParseIdPipe } from "src/common/pipes/parseIdPipe";

@Controller("chats")

export class ChatController{

    constructor (private readonly chatService:ChatService){}
    
    @Get("rooms")
    async getRooms (@Req() request:Request){
        const user = request['user']

        const rooms = this.chatService.getRooms(user.sub)

        return rooms
    }

    @Get('/rooms/:id/messages')
    async getMessages(@Param('id', ParseIdPipe) roomId:ObjectId, @Req() request:Request){
        const user = request['user']

        const messages = await this.chatService.getMessages(user.sub, roomId)

        return messages
    }

}