import { Module } from '@nestjs/common';
import { RatingController } from './rating.controller';
import { RatingService } from './rating.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rating } from './entities/rating.entity';
import { OrderService } from '../order/order.service';
import { Order } from '../order/entities/order.entity';
import { UserModule } from '../User/user.module';
import { OrderModule } from '../order/order.module';
import { Product, ProductVariant } from '../product/entities/product.entity';

@Module({
    imports:[TypeOrmModule.forFeature([Rating, Order, Product, ProductVariant]), UserModule, OrderModule],
    controllers:[RatingController],
    providers:[RatingService, OrderService],
    exports:[RatingService, OrderService]
})


export class RatingModule {}
