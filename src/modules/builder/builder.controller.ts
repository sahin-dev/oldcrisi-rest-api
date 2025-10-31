import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Req } from "@nestjs/common";
import { CreateFolderDto } from "./dtos/create-folder.dto";
import { BuilderService } from "./builder.service";
import { ResponseMessage } from "src/common/decorators/apiResponseMessage.decorator";
import { ObjectId } from "typeorm";
import { AddItemDto } from "./dtos/add-item.dto";
import { ParseIdPipe } from "src/common/pipes/parseIdPipe";

@Controller("builder")
export class BuilderController {

    constructor (private readonly builderService:BuilderService){}


    @Post()
    @ResponseMessage("folder created successfully")
    async createFolder(@Req() request:Request, @Body() createFolderDto:CreateFolderDto){
        const user = request['user']
        const folder = await  this.builderService.createFolder(user.sub, createFolderDto)

        return folder
    }   

    @Post("/item")
    @ResponseMessage("item added successfully")
    @HttpCode(HttpStatus.OK)
    async addItem(@Req() request:Request, @Body() addItemDto:AddItemDto){
        const user = request['user']
        const result = await this.builderService.addItem(user.sub, addItemDto.folderId,  addItemDto.item)

        return result
    }

    @Get("folders")
    async listFolders(@Req() request:Request){
        const user = request['user']

        const folders = this.builderService.list(user.sub)
        return folders
    }
    @Get("folders/items/:id")
    async getFolderItems(@Param("id", ParseIdPipe) id:ObjectId, @Req() request:Request){
        const user = request['user']

        const items = await this.builderService.getSpecificFolderItems(user.sub, id)
    
        return items
    }
}