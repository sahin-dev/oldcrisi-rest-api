import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateNotificationDto } from "./dtos/create-notification.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Notification } from "./entities/notification.entity";
import { MongoRepository } from "typeorm";
import { ObjectId } from "mongodb";
import { PushNotificationProvider } from "./providers/pushNotification.provider";


@Injectable()
export class NotificationService {

    constructor(@InjectRepository(Notification) private readonly notificaitonRepository:MongoRepository<Notification>,firebaseProvider:PushNotificationProvider){}

    async createNotification(userId:ObjectId, createNotificationDto:CreateNotificationDto){
        const notification = this.notificaitonRepository.create({...createNotificationDto, sender:userId, isRead:false})

        return await this.notificaitonRepository.save(notification)
    }

    async getNotifications(userId:ObjectId){
        const notifications = await this.notificaitonRepository.find({receiver:userId})

        return notifications
    }

    async getNotificationsDetails(notificationId:ObjectId){
        const notification = await this.notificaitonRepository.findOne({where:{_id:notificationId}})

        if(!notification){
            throw new NotFoundException("notification not found")
        }

        return notification
    }

    async readAllNotifications(userId:ObjectId){
        const notifications = await this.notificaitonRepository.update({receiver:userId}, {isRead:true})

        return notifications
    }

}