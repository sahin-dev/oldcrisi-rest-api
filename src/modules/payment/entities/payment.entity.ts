import { ObjectId } from "mongodb";
import { BaseEntity } from "src/common/entities/base.entity";
import { Column, Entity } from "typeorm";
import { PaymentStatus } from "../enums/paymentStatus.enum";

@Entity({
    name:"payments"
})
export class Payment extends BaseEntity{

    @Column()
    userId:ObjectId

    @Column()
    orderId:ObjectId

    @Column()
    point_spent:number

    @Column()
    point_discount:number

    @Column()
    amount:number

    @Column()
    status:PaymentStatus

    @Column()
    paymentDate:Date

    @Column()
    stripeSessionId:string

    @Column()
    transactionId:string

    @Column()
    orderNo:string

}
