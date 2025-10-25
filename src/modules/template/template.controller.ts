import { Body, Controller, DefaultValuePipe, Delete, Get, Param, ParseIntPipe, Post, Query, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { Roles } from "src/common/decorators/role.decorator";
import { CreateTemplateDto } from "./dtos/create-template.dto";
import { TeamplateService } from "./template.service";
import { ParseIdPipe } from "src/common/pipes/parseIdPipe";
import { ObjectId } from "mongodb";
import { RolesEnum } from "../User/enums/role.enum";
import { PaginationDto } from "./dtos/pagination.dto";


@Controller("templates")
export class TemplateController{

    constructor(private readonly tempateService:TeamplateService){}


     @Roles('admin')
        @Post()
        @UseInterceptors(FileInterceptor('image', {
            limits: { files: 1, fileSize:1000000 },
            storage: diskStorage({
                destination:'./uploads/templates',
                filename:(req, file, callback) => {
                    callback(null, file.originalname)
                },
            
            })
    
        }))
    
    async addtemplate(@Body() createTeampleDto:CreateTemplateDto, @UploadedFile() file:Express.Multer.File){
        const template = await this.tempateService.createTemplate(createTeampleDto, file)

        return template
    }

    @Delete(":id")
    async deleteTemplate(@Param("id", ParseIdPipe) id:ObjectId){
        const template = await this.tempateService.deleteTemplate(id)

        return template
    }       

    @Roles(RolesEnum.ADMIN)
    @Get()
    async getTemplates(@Query() paginationDto:PaginationDto){

        const templates = await this.tempateService.getTemplates(paginationDto)

        return templates
    }

    async updateTemplate(){}

}