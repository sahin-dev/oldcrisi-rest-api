import { Module } from '@nestjs/common';
import { FavouriteService } from './favourite.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Favourite } from './entities/favourite.entity';
import { FavouriteController } from './favourite.controller';
import { ProductService } from '../product/product.service';
import { Product, ProductVariant } from '../product/entities/product.entity';
import { ProductModule } from '../product/product.module';

@Module({
    imports:[TypeOrmModule.forFeature([Favourite, Product, ProductVariant]), ProductModule],
    controllers:[FavouriteController],
    providers:[FavouriteService]
})
export class FavouriteModule {}
