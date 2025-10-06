import { Body, Controller, Req, RequestMapping, RequestMethod } from "@nestjs/common";
import { ResponseMessage } from "src/common/decorators/apiResponseMessage.decorator";
import { OrderService } from "./order.service";
import { CreateOrderDto } from "./dtos/create-order.dto";

@Controller({path:'orders'})

export class OrderController {
    constructor(private readonly orderService:OrderService){}

    @RequestMapping({path:'/', method:RequestMethod.POST})
    async createOrder(@Body() createOrderDto:CreateOrderDto, @Req() request: Request){

    
        const user = request['user']
        const order = await this.orderService.createOrder(user.sub, createOrderDto)

        return order
    }

    @RequestMapping({method:RequestMethod.GET})
    @ResponseMessage("Orders fetched successfully")
    getOrders(){
        return 'All orders'
    }


}