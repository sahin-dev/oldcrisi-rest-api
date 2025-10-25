import { ObjectId } from "mongodb";
import { BaseEntity } from "src/common/entities/base.entity";
import { Column, Entity } from "typeorm";

@Entity({
    name:"chats"
})
export class Chat extends BaseEntity {

    @Column()
    room:ObjectId

    @Column()
    sender:ObjectId

    @Column()
    receiver:ObjectId

    @Column()
    message:string

    @Column()
    isRead:boolean

}