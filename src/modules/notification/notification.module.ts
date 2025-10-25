import { Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { FireBaseNotificationProvider } from './providers/firebaseNotification.provider';
import { PushNotificationProvider } from './providers/pushNotification.provider';

@Module({
    imports:[TypeOrmModule.forFeature([Notification])],
    controllers:[NotificationController],
    providers:[NotificationService, {provide: PushNotificationProvider, useClass:FireBaseNotificationProvider}],
    // providers:[NotificationService, {provide: PushNotificationProvider, useClass:FireBaseNotificationProvider}]
})
export class NotificationModule {}
