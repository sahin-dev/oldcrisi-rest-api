import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductController } from './product.controller';
import { CategoryModule } from '../category/category.module';
import { CategoryService } from '../category/category.service';
import { Category } from '../category/entities/category.entity';
import { User } from '../User/entities/user.entity';
import { UserService } from '../User/user.service';
import { UserModule } from '../User/user.module';
import { OtpVerification } from '../User/entities/otpVerification.entity';
import { HashingProvider } from '../Auth/providers/AbstractHashing.provider';
import { BcryptProvider } from '../Auth/providers/bcrypt.provider';
import { SmsProvider } from '../User/providers/sms.provider';
import { SmtpProvider } from '../User/providers/smtp.provider';

@Module({
    imports:[TypeOrmModule.forFeature([Product, Category, User, OtpVerification]), CategoryModule],
    providers:[ProductService, CategoryService, UserService, {provide:HashingProvider, useClass:BcryptProvider}, {provide:SmsProvider, useClass:SmtpProvider}],
    controllers:[ProductController],
})
export class ProductModule {}
