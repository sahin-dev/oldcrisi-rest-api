import { Body, Controller, DefaultValuePipe, Param, ParseIntPipe, Query, Req, RequestMapping, RequestMethod } from "@nestjs/common";
import { ResponseMessage } from "src/common/decorators/apiResponseMessage.decorator";
import { OrderService } from "./order.service";
import { CreateOrderDto } from "./dtos/create-order.dto";
import { OrderStatusEnum } from "./enums/orderStatus.enum";
import { ObjectId } from "typeorm";
import type {  Request } from "express";
import { UpdateOrderStatusDto } from "./dtos/update-status.dto";
import { ParseIdPipe } from "src/common/pipes/parseIdPipe";
import { Roles } from "src/common/decorators/role.decorator";
import { SearchOrderDto } from "./dtos/search-order.dto";


@Controller({path:'orders'})
export class OrderController {

    constructor(private readonly orderService:OrderService){}

    @RequestMapping({path:'/', method:RequestMethod.POST})
    @ResponseMessage("order created successfully")
    async createOrder(@Body() createOrderDto:CreateOrderDto, @Req() request: Request){
    
        const user = request['user']
        const order = await this.orderService.createOrder(user.sub, createOrderDto)

        return order
    }

    @RequestMapping({method:RequestMethod.GET})
    @ResponseMessage("Orders fetched successfully")
    getOrders(@Query() searhOrderDto:SearchOrderDto, @Req() request:Request){
        const user = request['user']
        const orders = this.orderService.getOrders(user.sub, searhOrderDto,{page:searhOrderDto.page, limit: searhOrderDto.limit})
    
        return orders
    }

    @RequestMapping({path:'/:status',method:RequestMethod.GET})
    async getOrderByStatus(@Req() request:Request,@Param('status') status:OrderStatusEnum, @Query('page', new DefaultValuePipe(1), ParseIntPipe) page:number, @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit:number){
        const user = request['user']
        const orders = await this.orderService.getOrdersByStatus(user.sub, status, {page, limit})

        return orders
    }

    @RequestMapping({path:"/details/:id", method:RequestMethod.GET})
    @ResponseMessage('Order details fetched successfully')
    async getOrderDetails(@Param("id", ParseIdPipe) id:ObjectId, @Req() request:Request){    
        const user = request['user']
        const orderDetails = await this.orderService.getOrderDetails(user.sub, id);
        return orderDetails
    }

    @Roles("ADMIN")
    @ResponseMessage("order status updated successfully")
    @RequestMapping({path:"/:id", method:RequestMethod.PATCH})
    async updateOrderStatus(@Body() updateOrderStatusDto:UpdateOrderStatusDto, @Param("id", ParseIdPipe) orderId:ObjectId){

        const result = await this.orderService.updateOrderStatus(orderId, updateOrderStatusDto.status)

        return result
    }





}