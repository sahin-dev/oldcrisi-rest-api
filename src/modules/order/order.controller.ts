import { Controller, RequestMapping, RequestMethod } from "@nestjs/common";
import { ResponseMessage } from "src/common/decorators/apiResponseMessage.decorator";
import { OrderService } from "./order.service";

@Controller({path:'orders'})

export class OrderController {
    constructor(private readonly orderService:OrderService){}

    @RequestMapping({method:RequestMethod.GET})
    @ResponseMessage("Orders fetched successfully")
    getOrders(){
        return 'All orders'
    }


}