import { ObjectId } from "mongodb";
import { MongoRepository } from "typeorm";
import { Favourite } from "./entities/favourite.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { ProductService } from "../product/product.service";


export class FavouriteService{

    constructor(@InjectRepository(Favourite) private readonly favouriteRepository:MongoRepository<Favourite>, private readonly productService:ProductService){}

    async toggoleFavourite(userId:ObjectId, productId:ObjectId){

        if(await this.isFavouriteExist(userId, productId)){
            return await this.removeFavourite(userId, productId)
        }
        
        const favourite =  await this.addFavourite(userId, productId)
        const productDetails = await this.productService.getProductDetails(favourite.product)

        return {...favourite, product:productDetails.product}
    }

    async addFavourite(userId:ObjectId, productId:ObjectId){

        const favourite = this.favouriteRepository.create({user:userId, product:productId})

        return await this.favouriteRepository.save(favourite)
    }

    async removeFavourite(userId:ObjectId, productId:ObjectId){
        return await this.favouriteRepository.delete({user:userId, product:productId})

    }

    async isFavouriteExist(userId:ObjectId, productId:ObjectId){
        const isExist = await this.favouriteRepository.findOne({where:{user:userId, product:productId}})

        return isExist? true:false
    }

    async getUserFavouriteList(userId:ObjectId){
        const favouriets = await this.favouriteRepository.find({user:userId})

        const mappedFavourites = favouriets.flatMap(async favourite => {
            const favouriteProductDetails = await this.productService.getProductDetails(favourite.product)

            return {...favourite, product:favouriteProductDetails.product}
        })

        return await Promise.all(mappedFavourites)
    }
}