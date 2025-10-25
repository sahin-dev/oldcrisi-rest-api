import { Injectable, NotFoundException, Req } from "@nestjs/common";
import { ObjectId } from "mongodb";
import { CreateChatDto } from "./dtos/create-chat.dto";
import { MongoRepository } from "typeorm";
import { Chat } from "./entities/chat.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Room } from "./entities/room.entity";
import { UserService } from "../User/user.service";
import { NotFoundError } from "rxjs";
import { WsException } from "@nestjs/websockets";

@Injectable()
export class ChatService {

    constructor(
    @InjectRepository(Chat) private readonly chatRepository:MongoRepository<Chat>,
    @InjectRepository(Room) private readonly roomRepository:MongoRepository<Room>,
    private readonly userService:UserService
){}

    async createChat(userId:ObjectId, createChatDto:CreateChatDto){
        let room = await this.roomRepository.findOne({where:{$or:[
            {user1:userId, user2:createChatDto.receiver},
            {user2:userId, user1:createChatDto.receiver}
        ]}})

        const sender = new ObjectId(userId)
        const receiver = new ObjectId(createChatDto.receiver)

        if(!room){
            room =  this.roomRepository.create({user1:sender, user2:receiver})
            await this.roomRepository.save(room)

        }

        const chat = this.chatRepository.create({room:room._id,sender, receiver, isRead:false, message:createChatDto.message})

        await this.chatRepository.save(chat)

        const receiverDetails = await this.userService.findOne(receiver)
        const senderDeatils = await this.userService.findOne(sender)

        return {...chat, receiver:receiverDetails,sender:senderDeatils, room}
    }

    async getRoomDetails(roomId:ObjectId){
        const room = await this.roomRepository.findOne({where:{_id:roomId}})
        if(!room){
            throw new NotFoundException("room not found")
        }

        const roomUser1 = await this.userService.findOne(room.user1)
        const roomUser2 = await this.userService.findOne(room.user2)

        return {...room, user1:roomUser1, user2:roomUser2}
    }

    async getRooms(userId:ObjectId){
        
        const rooms = await this.roomRepository.find({where:{$or:[
            {user1:userId},
            {user2:userId}
        ]},order:{createdAt:"DESC"}})

 
        const mappedRooms = await Promise.all(rooms.map(async room => {
            const roomDetails = await this.getRoomDetails(room._id)

            return roomDetails
        }))

        return mappedRooms
    }

    async getMessageDetails(messageId:ObjectId){
        const message = await this.chatRepository.findOne({where:{_id:messageId}})

        if(!message){
            throw new WsException("message not found")
        }

        const room = await this.getRoomDetails(message.room)

        const sender = await this.userService.findOne(message.sender)
        const receiver = await this.userService.findOne(message.receiver)

        return {...message, sender, receiver, room}
    }

    async getMessages(userId:ObjectId, roomId:ObjectId){
        console.log(roomId)
        const room = await this.roomRepository.findOne({where:{_id:roomId}})
        if(!room){
            throw new WsException("Room not found")
        }

        const messages = await this.chatRepository.find({where:{room:room._id}, order:{createdAt:"DESC"}})

        const detailedMessages = messages.map(async message => {
            const messageDetails = await this.getMessageDetails(message._id)
            return messageDetails
        })

        return await Promise.all(detailedMessages)
    }
}