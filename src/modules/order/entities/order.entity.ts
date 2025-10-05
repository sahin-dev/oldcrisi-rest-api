import { ObjectId } from "mongodb";
import { BaseEntity } from "src/common/entities/base.entity";
import { Entity } from "typeorm";
import { OrderStatusEnum } from "../enums/orderStatus.enum";

@Entity({
    name:'orders'
})
export class Order extends BaseEntity{

    userId:ObjectId

    products:ObjectId[]

    total:number

    subTotal:number

    status:OrderStatusEnum
    
    billingAddress:Address

    shippingAddress:Address

    constructor(){
        super()
        this.status = OrderStatusEnum.Processing
    }

}

class Address {

    city:string

    zip:number

    location: string

}