import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SignInDto {
  
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  fcmToken:string
}
