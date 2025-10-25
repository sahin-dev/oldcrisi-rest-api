import { BadRequestException, Injectable, NotFoundException, Param, Patch, Post, Query, UnauthorizedException, UseInterceptors } from "@nestjs/common";
import { Between, MongoRepository } from "typeorm";
import { Product, ProductVariant } from "./entities/product.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateProductDto } from "./dtos/create-product.dto";
import { CategoryService } from "../category/category.service";
import { ObjectId } from "mongodb";
import { UserService } from "../User/user.service";
import { UpdateProductDto } from "./dtos/update-product.dto";
import path from "path";
import fs from 'fs'
import {type Pagination } from "src/common/types/pagination";
import { SearchFilterProvider } from "./providers/filtering.provider";
import { UpdateProductVariantDto } from "./dtos/update-varint.dto";
import { CreateProductVariantDto } from "./dtos/create-variant.dto";
import { RolesEnum } from "../User/enums/role.enum";
import { PaginationDto } from "src/common/dtos/pagination.dto";


@Injectable()
export class ProductService {

    constructor(
        @InjectRepository(Product) private readonly productrepository: MongoRepository<Product>,
        @InjectRepository(ProductVariant) private readonly productVariantRepo: MongoRepository<ProductVariant>,
        private readonly categoryService: CategoryService,
        private readonly userService: UserService,
        private filterBuilder:SearchFilterProvider
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
            // price: createProductDto.price,
            swappable: createProductDto.swappable,
            images: imagePath,
        })


        const createdProduct =  await this.productrepository.save(product)


        let addedVariants:Array<Promise<ProductVariant>> = []
        createProductDto.variants.forEach(async variant => {
            const v = this.productVariantRepo.create({...variant, product:createdProduct._id})
            const savedVariant = this.productVariantRepo.save(v)
            addedVariants.push(savedVariant)
        })

        return {product, variants:await Promise.all(addedVariants)}

    }

    async getProducts(categoryStr:string | undefined, pagination:Pagination = {page:1, limit:20}){
        let skip = ( pagination.page -1) * pagination.limit
        if(categoryStr){
            const category = await this.categoryService.isCategoryExist(categoryStr)
            if(!category) return []
        
            return await this.productrepository.find({where:{category:category._id}, skip, take:pagination.limit})
        }
      
        return await this.productrepository.find({skip, take:pagination.limit})
    }

    async getMyProducts (userId:ObjectId, categoryStr?:string, pagination:Pagination = {page:1, limit:20}){

        let skip = (pagination.page - 1) * pagination.limit

        if(categoryStr){
            const category = await this.categoryService.isCategoryExist(categoryStr)
            if(!category) return []
            
            return await this.productrepository.find({where:{userId,category:category._id}, skip, take:pagination.limit})
        }
      
        return await this.productrepository.find({where:{user:userId}, skip, take:pagination.limit})
    }


    async getProductDetails (productId:ObjectId){
        const product = await this.productrepository.findOne({where:{_id:productId}})

        if(!product){
            throw new NotFoundException("Product not found")
        }

        const variants = await this.productVariantRepo.find({where:{product:product._id}})
        const categoryDetails = await this.categoryService.findOne(new ObjectId(product.category))

        const userDetails = await this.userService.findOne(product.user)

        return {product, category:categoryDetails, user:userDetails,variants}
    }

    async findOne(productId:ObjectId){
        const product = await this.productrepository.findOne({where:{_id:productId}})

        return product
    }

    // Add product variant

    async addProductVarint(createVariantDto:CreateProductVariantDto){
        console.log(createVariantDto)
        const product = await this.productrepository.findOne({where:{_id:createVariantDto.product}})

        if(!product){
            throw new NotFoundException("product not found")
        }

        const variant = this.productVariantRepo.create({product:product._id, price:createVariantDto.price, size:createVariantDto.size})

        return await this.productVariantRepo.save(variant)
    }

    async getProductVariants (productId:ObjectId){
        let variants = await this.productVariantRepo.find({where:{product:productId}})

        return variants
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
        // product.price = updateProductDto.price || product.price
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

    async updatePorductVariant (id:ObjectId, updateVarintDto:UpdateProductVariantDto){

        const variant = await this.productVariantRepo.findOneBy({_id:id})

        if(!variant){
            throw new NotFoundException("Variant not found")
        }

        variant.price = updateVarintDto.price || variant.price
        variant.size = updateVarintDto.size || variant.size

        return await this.productVariantRepo.save(variant)
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


    async deleteVariant (userId:string,variantId:ObjectId) {

        const variant = await this.productVariantRepo.findOne({where:{_id:variantId}})
        
        if(!variant){
            throw new NotFoundException("Variant not found")
        }

        const product = await this.productrepository.findOne({where:{_id:variant.product}})


        if(product?.user.toString() !== userId){
            throw new BadRequestException("you are not authroized to delete this product")
        }

        return await this.productVariantRepo.delete({_id:variant._id})

    }

    async searchProduct ( pagination:Pagination,query?:string, category?:ObjectId,maxPrice?:number, minPrice?:number,){

        if(category){
            this.filterBuilder.addCategory(category)
        }

      
        let skip = ( pagination.page - 1) * pagination.limit

       
        const products  = await this.productrepository.find({where:{$or:[
            {name:{ $regex: query, $options: 'i'}},
            {title:{ $regex: query, $options: 'i'}}
        ]}, skip, take:pagination.limit})
        

        let filteredProducts = products.map( async product => {
            
            const variants = await this.productVariantRepo.find({where:{
                product:product._id,
                price:{$gte:minPrice, $lte:maxPrice}
            }})
            
            if(variants.length <= 0) return {}

           return {...product, variants}
        })
       

        return Promise.all(filteredProducts)
    }


    async getOldCrisisProducts(pagination:Pagination) {
        let skip =  (pagination.page - 1) * pagination.limit
        const products = await this.productrepository.find({where:{createdBy:RolesEnum.ADMIN}, skip, take:pagination.limit})

        return products
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
