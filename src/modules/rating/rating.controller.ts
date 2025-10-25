import { Body, Controller, Get, Param, Post, Query, Req } from "@nestjs/common";
import { CreateRatingDto } from "./dtos/create-rating.dto";
import { RatingService } from "./rating.service";
import { ObjectId } from "mongodb";
import { ParseIdPipe } from "src/common/pipes/parseIdPipe";

@Controller("ratings/")
export class RatingController{

    constructor(private readonly ratingService:RatingService){}


    @Post()
    async postRating(@Body() createRatingDto:CreateRatingDto, @Req() request:Request){
        const user = request['user']
        const rating = await this.ratingService.postRating(new ObjectId(user.sub as string),createRatingDto )

        return rating
    }

    @Get(':id')
    async getUserRating(@Param('id', ParseIdPipe) supplierId:ObjectId){
        const rating = await this.ratingService.getSupplierAverageRating(supplierId)
        return rating
    }

}