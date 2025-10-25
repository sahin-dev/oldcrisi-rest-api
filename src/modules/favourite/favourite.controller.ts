import { Body, Controller, Get, Post, Req } from "@nestjs/common";
import { ParseIdPipe } from "src/common/pipes/parseIdPipe";
import { ObjectId } from "mongodb";
import { FavouriteService } from "./favourite.service";

@Controller('favourites/')
export class FavouriteController{

    constructor(private readonly favouriteService:FavouriteService){}

    @Post()
    async toggoleFavourite(@Body('product', ParseIdPipe) product:ObjectId, @Req() request:Request){

        const user = request['user']

        return await this.favouriteService.toggoleFavourite(new ObjectId(user.sub as string), product)


    }

    @Get()
    async getUserFavouriteList(@Req() request:Request){
        const user = request['user']

        const favouriteList = await this.favouriteService.getUserFavouriteList(new ObjectId(user.sub as string))

        return favouriteList
    }

}