import { Injectable } from "@nestjs/common";
import { CreateTemplateDto } from "./dtos/create-template.dto";
import { MongoRepository } from "typeorm";
import { Template } from "./entities/template.entity";
import { ObjectId } from "mongodb";
import { InjectRepository } from "@nestjs/typeorm";
import { PaginationDto } from "./dtos/pagination.dto";

@Injectable()
export class TeamplateService {
    constructor (@InjectRepository(Template)private readonly templateRepository:MongoRepository<Template>){}

    async createTemplate(createTemplateDto:CreateTemplateDto, file:Express.Multer.File){
        console.log(file)
        const template = this.templateRepository.create({image:file.path, title:"template", price:createTemplateDto.price})
    
        return await this.templateRepository.save(template)
    }

    async deleteTemplate(templateId:ObjectId){
        const deletedresult =  await this.templateRepository.delete(templateId);
        return deletedresult;
    }


    async getTemplates(paginationDto:PaginationDto){
        const {page = 1, limit = 20} = paginationDto

        const skip = (page-1) * limit

        const [templates, total] = await this.templateRepository.findAndCount({take:limit, skip, order:{createdAt:"DESC"}})
        
        return {page,templates, total}
    }

}