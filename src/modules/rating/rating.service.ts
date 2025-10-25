import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { MongoRepository, ObjectId } from "typeorm";
import { OrderService } from "../order/order.service";
import { Rating } from "./entities/rating.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateRatingDto } from "./dtos/create-rating.dto";
import { UserService } from "../User/user.service";
import { OrderStatusEnum } from "../order/enums/orderStatus.enum";

@Injectable()
export class RatingService{

    constructor(private readonly orderService:OrderService, @InjectRepository(Rating) private readonly ratingRepository:MongoRepository<Rating>, private readonly userService:UserService){}

    async postRating(userId:ObjectId,createRatingDto:CreateRatingDto){

        const order = await this.orderService.getOrderDetails(userId,createRatingDto.order)

        if(!order){
            throw new NotFoundException("Order not found")
        }

        if(order.status !== OrderStatusEnum.Completed){
            throw new BadRequestException("You are not allowed to provide rating yet!")
        }

        const rating = this.ratingRepository.create({user:userId,supplier:createRatingDto.supplier, order:order._id, point: createRatingDto.point})

        return await this.ratingRepository.save(rating)

    }

    async getSupplierAverageRating(userId:ObjectId){
        const ratings = await this.ratingRepository.find({where:{supplier:userId}})
        const totalRatingCount = ratings.length

        const totalPoint = ratings.reduce((pre, rating) => pre + rating.point, 0 )

        const mappedRatingDetails = ratings.map(async rating => {
            let ratingProvider = await this.userService.findOne(rating.user)
            let orderdetails = await this.orderService.getOrderDetails(userId,rating.order)
            return {rating:rating.point, provider:ratingProvider, order:orderdetails}
        })

        const averageRating = totalPoint / totalRatingCount

        return {averageRating, ratings:await Promise.all(mappedRatingDetails)}

    }


}