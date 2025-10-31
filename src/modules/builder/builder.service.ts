import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { ObjectId } from "mongodb";
import { CreateFolderDto } from "./dtos/create-folder.dto";
import { MongoRepository } from "typeorm";
import { Builder } from "./entities/builder.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { ProductService } from "../product/product.service";
import { AddItemDto } from "./dtos/add-item.dto";


@Injectable()
export class BuilderService {

    constructor(@InjectRepository(Builder) private readonly builderRepository:MongoRepository<Builder>, private readonly productService:ProductService){}



    async createFolder(userId:ObjectId, createFolderDto:CreateFolderDto){
        const folder = this.builderRepository.create({title:createFolderDto.title, items:[], user:userId})
        const createdFolder = await this.builderRepository.save(folder)

        const items = createFolderDto.items

        items.forEach(item => {
            this.addItem(userId, folder._id, item)
        })

        return createdFolder
    }

    async list(userId:ObjectId){
        const folders = await this.builderRepository.find({where:{user:userId}})

        const mappedFolders = folders.map( folder => {
            const item_count = folder.items.length

            return {...folder, item_count}
        })

        return mappedFolders
    }
    async addItems (userId:ObjectId, addItemDto:AddItemDto){

        const folder = await this.builderRepository.findOne({where:{_id:addItemDto.folderId}})

        if(!folder){
            throw new NotFoundException("fodler not found")
        }
      

        return await this.builderRepository.findOne({where:{_id:folder._id}})
    }

    async addItem(userId:ObjectId, folderId:ObjectId, itemId:ObjectId){
        const folder = await this.builderRepository.findOne({where:{_id:folderId, user:userId}})
        console.log("folder", folder)   
        if(!folder){
            throw new NotFoundException("folder not found")
        }
        for (let item of folder.items){
             if(item.toString() === itemId.toString()){
               return folder
            } 
        }
       
        folder.items.push(new ObjectId(itemId))

        const addedFolder =  await this.builderRepository.save(folder)
        console.log("addedFolder", addedFolder)
        return addedFolder
    }

    async getSpecificFolderItems(userId:ObjectId, folderId:ObjectId){
        const folder = await this.builderRepository.findOne({where:{user:userId,_id:folderId}})
    
        if(!folder){
            throw new NotFoundException("Folder not found")
        }
        const productDetails = await Promise.all(folder.items.map(async item => {
        
            const product = await this.productService.findOne(item)

            return  product
        }))

        return productDetails
    }

}