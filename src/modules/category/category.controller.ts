import { Body, Controller, FileTypeValidator, Get, MaxFileSizeValidator, Param, ParseFilePipe, Patch, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { CreateCategoryDto } from "./dtos/create-category.dto";
import { CategoryService } from "./category.service";
import { ResponseMessage } from "src/common/decorators/apiResponseMessage.decorator";
import { diskStorage } from "multer";
import { Roles } from "src/common/decorators/role.decorator";
import { UpdateCategoryDto } from "./dtos/update-category.dto";
import { ParseIdPipe } from "src/common/pipes/parseIdPipe";
import { ObjectId } from "typeorm";

@Controller('categories/')
export class CategoryController {

    constructor(private readonly categorySrevice: CategoryService) { }

    @Roles('admin')
    @Post()
    @UseInterceptors(FileInterceptor('image', {
        limits: { files: 1, fileSize:1000000 },
        storage: diskStorage({
            destination:'./uploads/categories',
            filename:(req, file, callbask) => {
                callbask(null, file.originalname)
            },
        
        })

    }))
    
    @ResponseMessage("category created successfully")
    async addCategory(@Body() createCategoryDto: CreateCategoryDto, @UploadedFile() file: Express.Multer.File) {

        const createdCategory = await this.categorySrevice.createCategory(createCategoryDto, file)

        return createdCategory
    }

    @Get()
    @ResponseMessage('categories fetched successfully.')
    async getCategories() {
        const categories = await this.categorySrevice.getAllCategories()
        return categories
    }

    @Roles('admin')
    @Patch(":id")
    @UseInterceptors(FileInterceptor('image', {
        limits: { files: 1, fileSize:1000000 },
        storage: diskStorage({
            destination:'./uploads/categories',
            filename:async (req, file, callbask) => {
               
                
                callbask(null, file.originalname)
            },
        
        })

    }))

    @ResponseMessage("category updated successfully")
    async updateCategory (@Param('id',ParseIdPipe ) id:ObjectId, @Body() updatedCategoryDto:UpdateCategoryDto, @UploadedFile() file: Express.Multer.File){
        const updatedCategory = await this.categorySrevice.updateCategory(id,updatedCategoryDto, file)

        return updatedCategory
    }

}