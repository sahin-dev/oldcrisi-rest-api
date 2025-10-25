import { Module } from '@nestjs/common';
import { SwapController } from './swap.controller';
import { SwapService } from './swap.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Swap } from './entities/swap.entity';
import { ProductModule } from '../product/product.module';


@Module({
    controllers:[SwapController],
    providers:[SwapService],
    imports:[TypeOrmModule.forFeature([Swap]), ProductModule]
})
export class SwapModule {}
