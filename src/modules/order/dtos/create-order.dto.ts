import { Type } from "class-transformer";
import { Address, OrderItem } from "../entities/order.entity";
import { IsNotEmpty } from "class-validator";


export class CreateOrderDto{

  
    @IsNotEmpty()
    items:OrderItem[]
    
    @Type(() => Address)
    @IsNotEmpty()
    billing_address:Address

    @Type(() => Address)
    @IsNotEmpty()
    shipping_address:Address
}
