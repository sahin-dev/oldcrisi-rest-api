import { Injectable, NotFoundException } from "@nestjs/common";
import { MongoRepository } from "typeorm";
import { Payment } from "./entities/payment.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { ObjectId } from "mongodb";
import { CreatePaymentDto } from "./dtos/create-payment.dto";
import { OrderService } from "../order/order.service";
import { PaymentStatus } from "./enums/paymentStatus.enum";
import { PaymentProvider } from "./providers/PaymentProvider.provider";

@Injectable()
export class PaymentService {

    public constructor (
        @InjectRepository(Payment) private readonly paymentRepository:MongoRepository<Payment>, 
        private readonly orderService:OrderService,
        private readonly paymentProvider:PaymentProvider
    ){}

    async initPayment (){

    }

    async createPayment(userId:ObjectId, createPaymentDto:CreatePaymentDto){
        const order = await this.orderService.getOrderDetails(userId, createPaymentDto.orderId)
        if(!order){
            throw new NotFoundException("order not found")
        }
        const point = createPaymentDto.point_spent || 0
        const  discount_applied_for_point = point * 1

        const money_after_point_applied = Math.max(0,order.total - point)

        const payment = this.paymentRepository.create({
            amount:money_after_point_applied, 
            orderId:order._id, 
            paymentDate:new Date(Date.now()),
            point_spent:point, point_discount:discount_applied_for_point,
            status:PaymentStatus.pending,
            userId,
        })

        return await this.paymentRepository.save(payment)
    }

    async getAllPayments(){}

    async getPaymentDetails(){}

    async getEarningGrowth(year:number): Promise<Array<{ month: number; total: number }>>{

        const start = new Date(year, 0, 1)
        const end = new Date(year+1, 0, 1)


        const pipeline = [
            {
                $match: {
                    paymentDate: { $gte: start, $lt: end },
                    status: PaymentStatus.succeeded,
                },
            },
            {
                $group: {
                    _id: { $month: "$paymentDate" },
                    total: { $sum: "$amount" },
                },
            },
            { $sort: { _id: 1 } },
        ]

        const cursor = this.paymentRepository.aggregate(pipeline)
        const results: Array<{ _id: number; total: number }> = await cursor.toArray()

        const months = Array.from({ length: 12 }, (_, i) => ({ month: i + 1, total: 0 }))
        results.forEach(r => {
            if (r._id >= 1 && r._id <= 12) {
                months[r._id - 1].total = r.total
            }
        })

        return months
    }

    async getTotalEarning (){
        const pipeline =[
            {$match:{status:PaymentStatus.succeeded}},
            {$group:{_id:null, total:{$sum:"$amount"}}}
        ]

        const result = await this.paymentRepository.aggregate(pipeline).toArray()
    
        return {total:result[0].total}
        
    }

}