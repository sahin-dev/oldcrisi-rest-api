import { Body, Controller, DefaultValuePipe, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, Req, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { ProductService } from "./product.service";
import { CreateProductDto } from "./dtos/create-product.dto";
import { FilesInterceptor } from "@nestjs/platform-express";
import { ResponseMessage } from "src/common/decorators/apiResponseMessage.decorator";
import { diskStorage } from "multer";
import { type Request } from "express";
import { Roles } from "src/common/decorators/role.decorator";
import { ParseIdPipe } from "src/common/pipes/parseIdPipe";
import { UpdateProductDto } from "./dtos/update-product.dto";
import { ObjectId } from "mongodb";
import { CreateProductVariantDto } from "./dtos/create-variant.dto";
import { UpdateProductVariantDto } from "./dtos/update-varint.dto";
import { QueryDto } from "./dtos/query.dto";
import { PaginationQuery } from "src/common/decorators/pagination-query.decorator";
import type { Pagination } from "src/common/types/pagination";



@Controller('products/')
export class ProductController {
    constructor (private readonly productService:ProductService){}

    @Post()
    // @Roles('admin')
    @UseInterceptors(FilesInterceptor("images", 5, {
        storage:diskStorage({
        
            destination:'uploads/product',
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

    @Post('/add-variant')
    @ResponseMessage("product variant added successfully")
    async addProductvariant(@Body() createvariantDto:CreateProductVariantDto){

        const createdvariant = await this.productService.addProductVarint(createvariantDto)

        return createdvariant
    }

    // @Roles('admin')
    @Get()
    async getAllProducts( @Query('category') category:string){
        
        const products = await this.productService.getProducts(category)

        return products
    }

    @Get('oldcrisis')
    @ResponseMessage("oldcrisis product fetched successfully")
    async getOldCrisisProducts(@Query('page',new DefaultValuePipe(1), ParseIntPipe) page:number = 1, @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit:number = 10){

        const results = await this.productService.getOldCrisisProducts({page,limit})

        return results
    }
    
    @Get("search")
    @ResponseMessage("product fetched successfully")
    async searchProduct(@Query() query:QueryDto,  @PaginationQuery()pagination:Pagination ){
    
        const products = await this.productService.searchProduct(pagination ,query.q,query.category, query.maxPrice, query.minPrice)

        return products
    }

     @Get('/my-products')
    async getMyProducts(@Req() request:Request, @Query('category') category:string){
        const user = request['user']

        const products = await this.productService.getMyProducts(new ObjectId(user.sub as string), category)

        return products
    }


    @Get(':id')
    async getProduct(@Param('id', ParseIdPipe) id:ObjectId){
        const product = await this.productService.getProductDetails(id)
       
        return product
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


    @Patch('variants/:id')
    @ResponseMessage("Product variant updated successfully")
    async updateProductvariant(@Param('id', ParseIdPipe) id:ObjectId, @Body() updateProductVariantDto:UpdateProductVariantDto){
        const updatedVariant = await this.productService.updatePorductVariant(id, updateProductVariantDto)

        return updatedVariant
    }


    @Delete(':id')
    @ResponseMessage("product deleted successfully")
    async deleteProduct(@Param('id', ParseIdPipe) id:ObjectId, @Req() request:Request){

        const user = request['user']
        this.productService.deleteProduct(user.sub,id)

    }

    @Delete('variants/:id')
    @ResponseMessage("Product variant deleted successfully")
    async deleteProductVariant(@Param('id', ParseIdPipe) id:ObjectId, @Req() request:Request){
        const user = request['user']
        const variant = await this.productService.deleteVariant(user.sub, id)

        return variant
    }



}