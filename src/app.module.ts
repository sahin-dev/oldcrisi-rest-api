import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthModule } from './modules/Auth/auth.module';
import { UserModule } from './modules/User/user.module';
import { AuthService } from './modules/Auth/auth.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { authConfig } from './config/auth.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './modules/User/entities/user.entity';
import { dbConfig } from './config/db.config';


@Module({
  imports: [
    ConfigModule.forRoot({load: [authConfig, dbConfig], ignoreEnvFile:true}),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mongodb',
        url: configService.get<string>('url'),
        entities: [User]
      }),
      inject: [ConfigService]
    }),
    UserModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [ AuthService],
})
export class AppModule {}
