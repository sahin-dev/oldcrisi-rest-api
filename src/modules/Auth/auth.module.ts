import { Module, OnModuleInit } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../User/user.module';
import { HashingProvider } from './providers/AbstractHashing.provider';
import { BcryptProvider } from './providers/bcrypt.provider';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    UserModule,
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('jwt.jwt_secret'),
        signOptions: {
          expiresIn: configService.get('jwt.jwt_token_ttl'),
          audience: configService.get('jwt.jwt_token_audience'),
          issuer: configService.get('jwt.jwt_token_issuer'),
        },
      }),
      inject: [ConfigService],
    }),
  ],

  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: HashingProvider,
      useClass: BcryptProvider,
    },
  ],
})
export class AuthModule {
  
}
