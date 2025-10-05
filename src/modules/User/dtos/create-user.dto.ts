
import { Exclude } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
export class CreateUserDto {
  
  @IsString({ message: 'fullName must be a string' })
  @IsNotEmpty({ message: 'fullName should not be empty' })
  @MinLength(3, { message: 'fullName must be at least 3 characters long' })
  fullName: string;

  @IsEmail()
  @IsNotEmpty({ message: 'email should not be empty' })
  email: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty({ message: 'password should not be empty' })
  @MinLength(6, { message: 'password must be at least 6 characters long' })
  @Exclude()
  password: string;
}
