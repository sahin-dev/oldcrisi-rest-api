import { Body, Controller, DefaultValuePipe, Get, Param, ParseIntPipe, Patch, Query, RequestMapping, RequestMethod, UploadedFile, UseInterceptors } from "@nestjs/common";
import { BlogService } from "./blog.service";
import { CreateBlogDto } from "./dtos/create-blog.dto";
import { Roles } from "src/common/decorators/role.decorator";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { UpdateBlogDto } from "./dtos/update-blog.dto";
import { ParseIdPipe } from "src/common/pipes/parseIdPipe";
import { ObjectId } from "typeorm";
import { ResponseMessage } from "src/common/decorators/apiResponseMessage.decorator";

@Controller({path:"news/"})
export class BlogController{
    constructor(private readonly blogService:BlogService){}

    @RequestMapping({path:"", method:RequestMethod.POST})
    @Roles('admin')
    @UseInterceptors(FileInterceptor('headerImage',{
        storage:diskStorage({
            destination:"./uploads/blog",
            filename:(req, file, cb) => {
                cb(null, file.originalname)
            }
        })
    }))
    @ResponseMessage("Blog created successfully")
    async createBlog(@Body() createBlogDto:CreateBlogDto, @UploadedFile() file:Express.Multer.File){

        return await this.blogService.createBlog(createBlogDto, file)
    }

    @Get("")
    @ResponseMessage("Blogs fetched successfully")
    async getAllBlogs(@Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1, @Query('limit',new DefaultValuePipe(10), ParseIntPipe) limit=10){
        return await this.blogService.getBlogs(page, limit)
    }

    @Get(':id')
    async getBlogDetails(@Param('id', ParseIdPipe) id:ObjectId){
        let blog = await this.blogService.getBlogDetails(id)

        return blog
    }

    @Patch(":id")
    @Roles('admin')
    @UseInterceptors(FileInterceptor('headerImage',{
        storage:diskStorage({
            destination:"./uploads/blog",
            filename:(req, file, cb) => {
                cb(null, file.originalname)
            }
        })
    }))
    @ResponseMessage("Blog updated successfully")
    async updateBlog(@Body() updateBlogDto:UpdateBlogDto, @Param('id', ParseIdPipe) id:ObjectId, @UploadedFile() file:Express.Multer.File){
        const updatedBlog = await this.blogService.updateBlog(id,updateBlogDto,file)    

        return updatedBlog
    }

    @RequestMapping({path:':id', method:RequestMethod.DELETE})
    @Roles('admin')
    @ResponseMessage("Blog deleted successfully")
    async deleteBlog(@Param('id', ParseIdPipe) id:ObjectId){
        const result = await this.blogService.deleteBlog(id)

        return result
    }

}