import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from './entities/chat.entity';
import { SocketGateway } from './gateway/socket.gateway';
import { Room } from './entities/room.entity';
import { UserModule } from '../User/user.module';

@Module({
    imports:[TypeOrmModule.forFeature([Chat, Room]), UserModule],
    controllers:[ChatController],
    providers:[ChatService, SocketGateway],
    exports:[ChatService]
})
export class ChatModule {}
