import { Injectable, NotFoundException } from "@nestjs/common";
import { MongoRepository } from "typeorm";
import { Blog } from "./entities/blog.entity";
import { CreateBlogDto } from "./dtos/create-blog.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { ObjectId } from "mongodb";
import { UpdateBlogDto } from "./dtos/update-blog.dto";
import {existsSync, rm} from 'fs'

@Injectable()
export class BlogService{

    constructor (@InjectRepository(Blog) private readonly blogRepository:MongoRepository<Blog>){}

    async createBlog(createBlogDto:CreateBlogDto, header:Express.Multer.File){
        
        const blog =  this.blogRepository.create(createBlogDto)
        console.log(header)
        if(header){
            blog.headerImage = header.path
        }

        return await this.blogRepository.save(blog)
    }

    async findOne(blogId:ObjectId){
        return await this.blogRepository.findOne({where:{_id:blogId}})
    }

    async getBlogs(page:number, limit:number){
        let skip = (page-1) * limit

        const blogs = await this.blogRepository.find({skip, take:limit,order:{createdAt:'DESC'}, select:['title', 'headerImage'], })

        return blogs
    }

    async getBlogDetails (blogId:ObjectId){
        let blog = await this.findOne(blogId)
        if(!blog){
            throw new NotFoundException("blog not found")
        }
        blog.reads = (blog.reads ?? 0) + 1;
        await this.blogRepository.save(blog);

        return blog
    }

    async updateBlog(blogId:ObjectId, updateBlogDto:UpdateBlogDto, header:Express.Multer.File){

        const blog = await this.findOne(blogId)
        if(!blog){
            throw new NotFoundException("Blog not found")
        }
        blog.title = updateBlogDto.title || blog.title
        blog.content = updateBlogDto.content || blog.content

        if(header){ 
            let oldPath = blog.headerImage
            if(existsSync(oldPath)){
                rm(oldPath, (err)=> {
                    if(err){
                        console.log("failed to delete old path")
                    }
                })
            }
            blog.headerImage = header.path
        }
            

        return await this.blogRepository.save(blog)

    }

    async deleteBlog(bolgId:ObjectId){  
        const blog = await this.findOne(bolgId)
        if(!blog){
            throw new NotFoundException("blog not found")
        }

        return await this.blogRepository.deleteOne({_id:blog._id})
    }

}