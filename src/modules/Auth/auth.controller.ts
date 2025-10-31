import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../User/dtos/create-user.dto';
import { SignInDto } from './dtos/signin.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { type Request } from 'express';
import { ObjectId } from 'mongodb';
import { ResponseMessage } from 'src/common/decorators/apiResponseMessage.decorator';

@Controller({path:'auth', version:"12"})
export class AuthController {
  constructor(@Inject() private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  async register(
    @Body() createUserDto: CreateUserDto,
    @Headers() headers: Headers,
  ) {
    return await this.authService.register(createUserDto);
  }

  @Public()
  @Post('signin')
  @HttpCode(HttpStatus.OK)
  signin(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto.email, signInDto.password, signInDto.fcmToken);
  }

  @Get('me')
  @ResponseMessage("User details fetched successfully")
  async getAuthenticatedUser(@Req() request: Request) {
    const req = request['user'];
    const sub = req['sub'] as string
    const userId = new ObjectId(sub)
    const user = await this.authService.getAuthenticatedUser(userId);

    return user;
  }
}
