import { MongoRepository } from "typeorm";
import { CreateSwapDto } from "./dtos/create-swap.dto";
import { Swap } from "./entities/swap.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { SwapStatusEnum } from "./enums/swapStatus.enum";
import { ObjectId } from "mongodb";
import { NotFoundException } from "@nestjs/common";
import { ProductService } from "../product/product.service";
import { UserService } from "../User/user.service";

export class SwapService {
    constructor (@InjectRepository(Swap) private readonly swapRepository:MongoRepository<Swap>, private readonly productService:ProductService, private readonly userService:UserService){}

    async createSwapRequest(userId:ObjectId,createSwapDto:CreateSwapDto){
        const swap = this.swapRepository.create({...createSwapDto, userFrom:userId, status:SwapStatusEnum.pending})
        return await this.swapRepository.save(swap)
    }

    async getRequestedSwaps(userId:ObjectId){
        const swaps =  await this.swapRepository.find({from:userId})

        const mappedSwaps = swaps.map(async swap => {
            const swapDetails = await this.getSwapRequestDetails(swap._id)

            return {...swap, ...swapDetails}
        })

        return await Promise.all(mappedSwaps)
    }

    async getSwapRequests(userId:ObjectId){
        const swaps =  await this.swapRepository.find({to:userId})

         const mappedSwaps = swaps.map(async swap => {
            const swapDetails = await this.getSwapRequestDetails(swap._id)

            return {...swap, ...swapDetails}
        })

        return await Promise.all(mappedSwaps)
    }

    async getSwapRequestDetails(swapId:ObjectId){
        const swap = await this.swapRepository.findOne({where:{_id:swapId}})
        if(!swap){
            throw new NotFoundException("Swap not found")
        }

        const productFromDetails = await this.productService.getProductDetails(swap.productFrom)
        const productToDetails = await this.productService.getProductDetails(swap.productTo)

        const userToDetails = await this.userService.findOne(swap.userTo)
        const userFromDetails = await this.userService.findOne(swap.userFrom)

        return {senderProduct:productFromDetails, sendFor:productToDetails,sender:userFromDetails, receiver:userToDetails }

    }

    async deleteSwapRequest(userId:ObjectId,swapId:ObjectId){
        
        const swap = await this.swapRepository.findOne({where:{_id:swapId, from:userId}})

        if(!swap){
            throw new NotFoundException("swap not found")
        }

        return await this.swapRepository.delete({_id:swapId})
    }

    async acceptSwapRequest(userId:ObjectId , swapId:ObjectId){
        const swap = await this.swapRepository.findOne({where:{_id:swapId, to:userId}})

        if(!swap){
            throw new NotFoundException("swap not found")
        }

        return await this.updateSwapStatus(userId, swapId, SwapStatusEnum.accepted)
    }

    async rejectSwapRequest(userId:ObjectId, swapId:ObjectId){
        const swap = await this.swapRepository.findOne({where:{_id:swapId, to:userId}})

        if(!swap){
            throw new NotFoundException("swap not found")
        }

        return await this.updateSwapStatus(userId, swapId, SwapStatusEnum.rejected)
    }

    async completeSwapRequest(userId:ObjectId, swapId:ObjectId){
        const swap = await this.swapRepository.findOne({where:{_id:swapId, to:userId}})

        if(!swap){
            throw new NotFoundException("swap not found")
        }

        return await this.updateSwapStatus(userId,swapId, SwapStatusEnum.completed)
    }

    async updateSwapStatus (userId:ObjectId,swapId:ObjectId, status:SwapStatusEnum){

        const swap = await this.swapRepository.findOne({where:{_id:swapId, to:userId}})

        if(!swap){
            throw new NotFoundException("swap not found")
        }

        return await this.swapRepository.update({_id:swapId}, {status})

    }
}