import { Injectable } from "@nestjs/common";
import { PushNotificationProvider } from "./pushNotification.provider";

@Injectable()
export class FireBaseNotificationProvider implements PushNotificationProvider{


    constructor(){}
}