import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Builder } from './entities/builder.entity';
import { BuilderController } from './builder.controller';
import { BuilderService } from './builder.service';
import { ProductModule } from '../product/product.module';

@Module({
    imports:[TypeOrmModule.forFeature([Builder]), ProductModule],
    controllers:[BuilderController],
    providers:[BuilderService]
})
export class BuilderModule {}
