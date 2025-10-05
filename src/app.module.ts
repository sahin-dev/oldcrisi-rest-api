import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthModule } from './modules/Auth/auth.module';
import { UserModule } from './modules/User/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './modules/User/entities/user.entity';
import { RolesGuard } from './common/gurads/roles.guard';
import { APP_GUARD } from '@nestjs/core';
import jwtConfig from './config/jwt.config';
import dbConfig from './config/db.config';
import { AuthGuard } from './modules/Auth/guards/jwt.guard';
import { JwtModule } from '@nestjs/jwt';
import mailerConfig from './config/mailer.config';
import { OtpVerification } from './modules/User/entities/otpVerification.entity';
import { CategoryModule } from './modules/category/category.module';
import { Category } from './modules/category/entities/category.entity';
import { ProductModule } from './modules/product/product.module';
import { Product } from './modules/product/entities/product.entity';
import { OrderModule } from './modules/order/order.module';
import { BlogModule } from './modules/blog/blog.module';
import { PaymentModule } from './modules/payment/payment.module';
import { BuilderModule } from './modules/builder/builder.module';
import { Blog } from './modules/blog/entities/blog.entity';

const ENV = process.env.NODE_ENV;

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [dbConfig, jwtConfig, mailerConfig],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: configService.get('db.type'),
        url: configService.get('db.url'),
        entities: [
          User,
          OtpVerification, 
          Category, 
          Product,
          Blog
        ],
        synchronize: true,
        logging: true,
      }),
  
    }),
    UserModule,
    AuthModule,
    JwtModule,
    CategoryModule,
    ProductModule,
    OrderModule,
    BlogModule,
    PaymentModule,
    BuilderModule
  ],
  controllers: [AppController],

  providers: [
    { provide: APP_GUARD, useClass: AuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard }
  ],
})
export class AppModule {
  

}
