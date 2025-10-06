import { Injectable } from "@nestjs/common"
import { CreateOrderDto } from "./dtos/create-order.dto";
import { Order, OrderItem } from "./entities/order.entity";
import { MongoRepository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class OrderService{

    constructor( @InjectRepository(Order) private readonly orderRepository:MongoRepository<Order>){}

    public async createOrder(userId:string, createOrderDto:CreateOrderDto){
        const totalQuantity = this.getTotalQuantity(createOrderDto.items)
        const totalAmount = this.getTotalAmount(createOrderDto.items)

        const order = this.orderRepository.create(
            {   
                userId,
                ietms:createOrderDto.items, 
                billingAddress:createOrderDto.billing_address, 
                shippingAddress:createOrderDto.shipping_address,
                total:totalAmount,
                subTotal: totalAmount,
                totalQuantity
            })

        return await this.orderRepository.save(order)

    }

    private getTotalQuantity (items:OrderItem[]){
        return items.reduce((pre,item) => pre + item.quantity, 0)
    }

    private getTotalAmount(items:OrderItem[]){
        return items.reduce((pre, item) => pre + (item.quantity * item.price), 0)
    }

    public async updateStatus(){

    }

}