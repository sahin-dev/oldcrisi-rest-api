import { Body, Controller, Get, Inject, Param, Patch, Post, Req } from "@nestjs/common";
import { NotificationService } from "./notification.service";
import { CreateNotificationDto } from "./dtos/create-notification.dto";
import { ObjectId } from "mongodb";
import { ParseIdPipe } from "src/common/pipes/parseIdPipe";


@Controller("notifications")
export class NotificationController {

    constructor(private readonly notificationService:NotificationService, ){}

    @Post()
    async createNotification(@Body() createNotificationDto:CreateNotificationDto, @Req() request:Request){
        const user = request['user']
        const notification = await this.notificationService.createNotification(user.sub, createNotificationDto)

        return notification

    }

    @Get()
    async getNotifications(@Req() request:Request){
        const user = request['user']

        const notifications = await this.notificationService.getNotifications(user.sub)

        return notifications
    }

    @Get(":id")
    async getNotificationDetails(@Param("id", ParseIdPipe) id:ObjectId){
        const notification = await this.notificationService.getNotificationsDetails(id)

        return notification
    }

    @Patch(":id")
    async updateNotification(){

    }

    @Patch("read")
    async readAllNotification(@Req() request:Request){
        const user = request['user']

        const notifications = await this.notificationService.readAllNotifications(user.sub)

        return notifications
    }
}
