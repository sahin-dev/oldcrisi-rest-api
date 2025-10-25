import { ObjectId } from "mongodb";
import { BaseEntity } from "src/common/entities/base.entity";
import { Column, Entity } from "typeorm";

@Entity({
    name:"notifications"
})
export class Notification extends BaseEntity{

    @Column()
    sender:ObjectId

    @Column()
    receiver:ObjectId

    @Column()
    title:string

    @Column()
    description:string

    @Column()
    isRead:boolean

}