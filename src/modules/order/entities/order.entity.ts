import { ObjectId } from "mongodb";
import { BaseEntity } from "src/common/entities/base.entity";
import { Column, Entity } from "typeorm";
import { OrderStatusEnum } from "../enums/orderStatus.enum";



export class Address {

    @Column()
    city:string

    @Column()
    zip:number

    @Column()
    location: string

}


export class OrderItem {

    @Column()
    product:ObjectId

    @Column()
    quantity:number

    @Column()
    price: number

    increaseQuantity(quantity:number){
        this.quantity  += quantity
    }

    decreaseQuantity (quantity:number){
        this.quantity = Math.min(this.quantity - quantity, 0)
    }

    updateQuantity(quantty:number){
        this.quantity = quantty
    }
}


@Entity({
    name:'orders'
})
export class Order extends BaseEntity{

    @Column()
    userId:ObjectId

    @Column()
    ietms:OrderItem[]

    @Column()
    total:number

    @Column()
    totalQuantity:number

    @Column()
    subTotal:number

    @Column()
    status:OrderStatusEnum
    
    @Column()
    billingAddress:Address

    @Column()
    shippingAddress:Address

    constructor(){
        super()
        this.status = OrderStatusEnum.Processing
    }

}
