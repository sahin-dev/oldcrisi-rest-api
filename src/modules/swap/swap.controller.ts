import { Body, Controller, Delete, Get, Param, Patch, Post, Req } from "@nestjs/common";
import { SwapService } from "./swap.service";
import { CreateSwapDto } from "./dtos/create-swap.dto";
import type { Request } from "express";
import { ObjectId } from "mongodb";
import { ParseIdPipe } from "src/common/pipes/parseIdPipe";
import { UpdateSwapDto } from "./dtos/update-swap.dto";


@Controller("swaps")
export class SwapController {

    constructor(private readonly swapService:SwapService){}


    @Post()
    async requestForSwap(@Body() createSwapDto:CreateSwapDto, @Req() request:Request){
        const user = request['user']
        const createdSwap = await this.swapService.createSwapRequest(user.sub , createSwapDto)

        return createdSwap

    }

    @Get("my-requests")
    async getRequestedSwaps(@Req() request:Request){
        const user = request['user']
        const requestedSwaps = await this.swapService.getRequestedSwaps(user.sub)

        return requestedSwaps
    }

    @Get()
    async getSwapRequests(@Req() request:Request){
        const user = request['user']

        const swapRequests = await this.swapService.getSwapRequests(user.sub)

        return swapRequests
    }

    @Patch(":id")
    async updateSwapRequest(@Param("id", ParseIdPipe) id:ObjectId, @Body()updateSwapDto:UpdateSwapDto, @Req() request:Request){
        const user = request['user']
        const swap = await this.swapService.updateSwapStatus(user.sub,id, updateSwapDto.status)

        return swap
    }

    @Delete(":id")
    async deleteSwapRequest(@Param("id", ParseIdPipe) id:ObjectId, @Req() request:Request){
        const user = request['user']

        return await this.swapService.deleteSwapRequest(user.sub, id)
    }
}