import { Body, Controller, Get, ParseIntPipe, Post, Query, Req } from "@nestjs/common";
import { CreatePaymentDto } from "./dtos/create-payment.dto";
import { PaymentService } from "./payment.service";
import { Roles } from "src/common/decorators/role.decorator";
import { RolesEnum } from "../User/enums/role.enum";


@Controller("payments")
export class PaymentController {

    constructor(private readonly paymentService:PaymentService){}

    @Post("create")
    async createPayment (@Body() createPaymentDto:CreatePaymentDto, @Req() request:Request){
        const user = request['user']
        const payment = await this.paymentService.createPayment(user.sub, createPaymentDto)

        return payment
        
    }

    @Get("growth")
    @Roles(RolesEnum.ADMIN)
    async getEarningGrowth(@Query("year", ParseIntPipe) year:number){
        const growthResult = await this.paymentService.getEarningGrowth(year)

        return growthResult
    }

    @Get("total-earning")
    @Roles(RolesEnum.ADMIN)
    async getTotalEarning(){
        const total = await this.paymentService.getTotalEarning()
        return total
    }

}