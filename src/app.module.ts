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
import { Product, ProductVariant } from './modules/product/entities/product.entity';
import { OrderModule } from './modules/order/order.module';
import { BlogModule } from './modules/blog/blog.module';
import { PaymentModule } from './modules/payment/payment.module';
import { BuilderModule } from './modules/builder/builder.module';
import { Blog } from './modules/blog/entities/blog.entity';
import { Order } from './modules/order/entities/order.entity';
import { RatingModule } from './modules/rating/rating.module';
import { Rating } from './modules/rating/entities/rating.entity';
import { FavouriteModule } from './modules/favourite/favourite.module';
import { Favourite } from './modules/favourite/entities/favourite.entity';
import { Builder } from './modules/builder/entities/builder.entity';
import { SitePolicyModule } from './modules/site-policy/site-policy.module';
import { Policy } from './modules/site-policy/entities/policy.entity';
import { SwapModule } from './modules/swap/swap.module';
import { Swap } from './modules/swap/entities/swap.entity';
import { NotificationModule } from './modules/notification/notification.module';
import { Notification } from './modules/notification/entities/notification.entity';
import { Payment } from './modules/payment/entities/payment.entity';
import { ChatModule } from './modules/chat/chat.module';
import { Chat } from './modules/chat/entities/chat.entity';
import { Room } from './modules/chat/entities/room.entity';
import { TemplateModule } from './modules/template/template.module';
import { Template } from './modules/template/entities/template.entity';
import { BulkOrderModule } from './modules/bulk-order/bulk-order.module';

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
          ProductVariant,
          Blog,
          Order,
          Rating,
          Favourite,
          Builder,
          Policy,
          Swap,
          Notification,
          Payment,
          Chat,
          Room,
          Template
        ],
        synchronize: true,
        logging: ['query'],
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
    BuilderModule,
    RatingModule,
    FavouriteModule,
    SitePolicyModule,
    SwapModule,
    NotificationModule,
    ChatModule,
    TemplateModule,
    BulkOrderModule
  ],
  controllers: [AppController],

  providers: [
    { provide: APP_GUARD, useClass: AuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard }
  ],
})
export class AppModule {
  

}
