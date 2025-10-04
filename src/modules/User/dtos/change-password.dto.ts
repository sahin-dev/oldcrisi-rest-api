import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty()
  previousPassword: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'password must be 6 character long' })
  newPassword: string;
}
