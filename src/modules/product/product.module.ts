import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product, ProductVariant } from './entities/product.entity';
import { ProductController } from './product.controller';
import { CategoryModule } from '../category/category.module';
import { CategoryService } from '../category/category.service';
import { Category } from '../category/entities/category.entity';
import { User } from '../User/entities/user.entity';
import { UserService } from '../User/user.service';
import { OtpVerification } from '../User/entities/otpVerification.entity';
import { UserModule } from '../User/user.module';
import { SearchFilterProvider } from './providers/filtering.provider';
import { RatingService } from '../rating/rating.service';
import { RatingModule } from '../rating/rating.module';
import { Rating } from '../rating/entities/rating.entity';


@Module({
    imports:[TypeOrmModule.forFeature([Product,ProductVariant, Category, User, OtpVerification, Rating]), CategoryModule, UserModule, RatingModule],
    providers:[ProductService, CategoryService, UserService, SearchFilterProvider, RatingService],
    controllers:[ProductController],
    exports:[ProductService, CategoryService, UserService, SearchFilterProvider, RatingService]
})
export class ProductModule {}
 