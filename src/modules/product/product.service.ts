import { BadRequestException, Injectable, NotFoundException, Param, Patch, Post, UnauthorizedException, UseInterceptors } from "@nestjs/common";
import { MongoRepository } from "typeorm";
import { Product } from "./entities/product.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateProductDto } from "./dtos/create-product.dto";
import { CategoryService } from "../category/category.service";
import { ObjectId } from "mongodb";
import { UserService } from "../User/user.service";
import { UpdateProductDto } from "./dtos/update-product.dto";
import path from "path";
import fs from 'fs'


@Injectable()
export class ProductService {

    constructor(
        @InjectRepository(Product) private readonly productrepository: MongoRepository<Product>,
        private readonly categoryService: CategoryService,
        private readonly userService: UserService
    ) { }



    async addProduct(userId:string,createProductDto: CreateProductDto, files: Array<Express.Multer.File>) {

        const user = await this.userService.findOne(new ObjectId(userId))
        if(!user){
            throw new NotFoundException("User not found")
        }

        const category = await this.categoryService.findOne(new ObjectId(createProductDto.categoryId))

        if(!category){
            throw new NotFoundException("category not found")
        }

    
        const imagePath:string[]  = []
        if(files){
           files.forEach(file => {
           imagePath.push(file.path)
        })
        }
       
        const product = this.productrepository.create({
            user:user._id,
            name: createProductDto.name,
            title: createProductDto.title,
            description: createProductDto.description,
            category:category._id, 
            createdBy: user.role, 
            price: createProductDto.price,
            swappable: createProductDto.swappable,
            images: imagePath

        })



        return await this.productrepository.save(product)

    }

    async getProducts(categoryStr:string | undefined){

        if(categoryStr){
            const category = await this.categoryService.isCategoryExist(categoryStr)
            if(!category) return []
        
            return await this.productrepository.find({where:{category:category._id}})
        }
      
        return await this.productrepository.find()
    }

    async getMyProducts (userId:ObjectId, categoryStr:string | undefined){
    
      if(categoryStr){
            const category = await this.categoryService.isCategoryExist(categoryStr)
            if(!category) return []
        
            return await this.productrepository.find({where:{userId,category:category._id}})
        }
      
        return await this.productrepository.find({wher:{userId}})
    }


    async getProductDetails (productId:ObjectId){
        const product = await this.productrepository.findOne({where:{_id:productId}})

        if(!product){
            throw new NotFoundException("Product not found")
        }
        const categoryDetails = await this.categoryService.findOne(new ObjectId(product.category))

        const userDetails = await this.userService.findOne(product.user)

        return {product, category:categoryDetails, user:userDetails}
    }

    async findOne(productId:ObjectId){
        const product = await this.productrepository.findOne({where:{_id:productId}})

        return product
    }


    async updateProduct (userId:ObjectId,productId:ObjectId, updateProductDto:UpdateProductDto, files:Array<Express.Multer.File>){

        const product = await this.findOne(productId)

        if(!product){
            throw new NotFoundException('Product not found')
        }
 
        if(product.user.toString() !== userId.toString()){
            throw new BadRequestException("Sorry you are not allowed to edit the product")
        }
        
        product.name = updateProductDto.name || product.name
        product.title = updateProductDto.title || product.title
        product.category = new ObjectId(updateProductDto.categoryId) || product.category
        product.description = updateProductDto.description || product.description
        product.price = updateProductDto.price || product.price
        product.swappable = updateProductDto.swappable || product.swappable

        let images = product.images
        let filesPath = files.map(file => file.path)

        if(files && files.length > 0){
             images = images.filter((image, idx) => {
                if(!filesPath.includes(image)){
                    const imagePath = path.join(process.cwd(),image)
                    this.deleteProductImage(imagePath)
                    return false
                }
                return true    
        })

        files.forEach(file => {
            if(!images.includes(file.path)){
                images.push(file.path)
            }
            
        })
        }

       

        product.images = images

        return await this.productrepository.save(product)
       
    }

    async deleteProduct(userId:string,productId:ObjectId){
        const product = await this.findOne(productId)
        if(!product)
            throw new NotFoundException("Product not found")

        if(product.user.toString() !== userId){
            throw new BadRequestException("you are not allowed to delete this product")
        }

        await this.productrepository.delete({_id:product._id})
    }

    private deleteProductImage(imagePath:string):Promise<void>{

        return new Promise(( resolve, reject) => {
            const resolvedPath = path.resolve(imagePath)
            if(fs.existsSync(resolvedPath)){
                fs.rm(resolvedPath, (err)=>{
                    if(err)
                        reject()
                    resolve()
                })
            }
        })

    }
}
