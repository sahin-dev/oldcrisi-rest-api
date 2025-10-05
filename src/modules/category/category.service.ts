import { MongoRepository } from "typeorm";
import { Category } from "./entities/category.entity";
import { CreateCategoryDto } from "./dtos/create-category.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { UpdateCategoryDto } from "./dtos/update-category.dto";
import { ObjectId } from "mongodb";
import path from "path";

@Injectable()
export class CategoryService {

    constructor(@InjectRepository(Category) private readonly categoryRepository: MongoRepository<Category>){}

   
    async createCategory (creatCategoryDto:CreateCategoryDto, file:Express.Multer.File){
        const isCategoryExist = await this.isCategoryExist(creatCategoryDto.name)

        if(isCategoryExist){    
            throw new ConflictException("Category already exist")
        }
    
        const category = this.categoryRepository.create({name:creatCategoryDto.name, image: file.path})

        return await this.categoryRepository.save(category)
    }

    async getAllCategories(){

        const categories = this.categoryRepository.find({})

        return categories
    }

    async isCategoryExist(name:string){
        const category = await this.categoryRepository.findOneBy({name})

        if(category)
            return category

        return false
    }

    async findOne(id:ObjectId){
        return await this.categoryRepository.findOneBy({_id:id})
    }

    async updateCategory(id:ObjectId,updateCategoryDto:UpdateCategoryDto, file:Express.Multer.File){
        const category = await this.findOne(id)
        if(!category){
            throw new NotFoundException("category not found")
        }
        if(updateCategoryDto.name)
            category.name = updateCategoryDto.name

        if(file){
            let oldpath = path.join(__dirname)
            console.log(oldpath)
            category.image = file.path
            
        }

        const updatedCategory = await this.categoryRepository.save(category)
        return updatedCategory

    }

}