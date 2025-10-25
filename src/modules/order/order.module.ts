import { forwardRef, Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { UserModule } from '../User/user.module';
import { UserService } from '../User/user.service';
import { Product, ProductVariant } from '../product/entities/product.entity';
import { ProductService } from '../product/product.service';
import { CategoryService } from '../category/category.service';
import { SearchFilterProvider } from '../product/providers/filtering.provider';
import { Category } from '../category/entities/category.entity';

@Module({
    imports:[TypeOrmModule.forFeature([Order, Product, Category, ProductVariant]), UserModule],
    controllers:[OrderController],
    providers:[OrderService, UserService, ProductService, CategoryService, SearchFilterProvider],
    exports:[OrderService, ProductService, UserService, CategoryService, SearchFilterProvider]
})
export class OrderModule {}
