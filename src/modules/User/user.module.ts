import { Module, OnModuleInit } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { CreateUserService } from './providers/create-user.provider';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from '../Auth/guards/jwt.guard';
import { HashingProvider } from '../Auth/providers/AbstractHashing.provider';
import { BcryptProvider } from '../Auth/providers/bcrypt.provider';
import { SmsProvider } from './providers/sms.provider';
import { SmtpProvider } from './providers/smtp.provider';
import { OtpVerification } from './entities/otpVerification.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, OtpVerification]), JwtModule],
  controllers: [UserController],
  providers: [
    UserService,
    CreateUserService,
    AuthGuard,
    {
      provide: HashingProvider,
      useClass: BcryptProvider,
    },
    {
      provide: SmsProvider,
      useClass: SmtpProvider,
    },
  ],
  exports: [UserService],
})
export class UserModule{
 
}
