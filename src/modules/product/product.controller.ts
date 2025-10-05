import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { ProductService } from "./product.service";
import { CreateProductDto } from "./dtos/create-product.dto";
import { FilesInterceptor } from "@nestjs/platform-express";
import { ResponseMessage } from "src/common/decorators/apiResponseMessage.decorator";
import { diskStorage } from "multer";
import { type Request } from "express";
import { Roles } from "src/common/decorators/role.decorator";
import { ParseIdPipe } from "src/common/pipes/parseIdPipe";
import { CategoryService } from "../category/category.service";
import { UpdateProductDto } from "./dtos/update-product.dto";
import { ObjectId } from "mongodb";


@Controller('products/')
export class ProductController {
    constructor (private readonly productService:ProductService, private readonly categoryService:CategoryService){}

    @Post()
    // @Roles('admin')
    @UseInterceptors(FilesInterceptor("images", 5, {
        storage:diskStorage({
        
            destination:'./uploads/product',
            filename:(req, file, callback) => {
                callback(null, file.originalname)
            },
        })
    }))


    @ResponseMessage("Product created successfully.")
    async addProuct(@Body() createProductDto:CreateProductDto, @Req() req:Request, @UploadedFiles() files:Array<Express.Multer.File>){

        const user = req['user']
        const product = await this.productService.addProduct(user.sub,createProductDto, files)

        return product
    }

    @Roles('admin')
    @Get()
    async getAllProducts( @Query('category') category:string){
        
        const products = await this.productService.getProducts(category)

        return products
    }

    @Get(':id')
    async getProduct(@Param('id', ParseIdPipe) id:ObjectId){
        const product = await this.productService.getProductDetails(id)
       
        return product
    }

    @Get('/my-products')
    async getMyProducts(@Req() request:Request, @Query('category') category:string){
        const user = request['user']

        const products = await this.productService.getMyProducts(user.sub, category)

        return products
    }

    @Patch(':id')
     @UseInterceptors(FilesInterceptor("images", 5, {
        storage:diskStorage({
        
            destination:'./uploads/product',
            filename:(req, file, callbask) => {
                callbask(null, file.originalname)
            },

        })
    }))
    async updateProduct (@Param('id', ParseIdPipe) id:ObjectId, @Body() updateProductDto:UpdateProductDto, @Req() request:Request, @UploadedFiles() files: Array<Express.Multer.File>){
        const user = request['user']
    
        const result = await this.productService.updateProduct(new ObjectId(user.sub), id,updateProductDto, files)

        return result
    }

    @Delete(':id')
    @ResponseMessage("product deleted successfully")
    async deleteProduct(@Param('id', ParseIdPipe) id:ObjectId, @Req() request:Request){

        const user = request['user']
        this.productService.deleteProduct(user.sub,id)

    }



}