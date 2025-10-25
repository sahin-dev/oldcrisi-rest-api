import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  SerializeOptions,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Roles } from 'src/common/decorators/role.decorator';
import { AuthGuard } from '../Auth/guards/jwt.guard';
import { ObjectId } from 'typeorm';
import { Public } from 'src/common/decorators/public.decorator';
import { UpdateUserDto } from './dtos/update-user.dto';
import { ChangePasswordDto } from './dtos/change-password.dto';
import { ForgetPasswordDto } from './dtos/forget-password.dto';
import { VerifyOtpDto } from './dtos/verify-otp.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { ParseIdPipe } from 'src/common/pipes/parseIdPipe';
import { User } from './entities/user.entity';
import { GetUserDto } from './dtos/get-user.dto';
import { ResponseMessage } from 'src/common/decorators/apiResponseMessage.decorator';
import { RolesEnum } from './enums/role.enum';

@Controller('users/')
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({type:GetUserDto})
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Roles('admin')
  async getAllUsers() {
    return this.userService.findAll();
  }

  @Get("growth")
  @Roles(RolesEnum.ADMIN)
  async getUserGrowth(@Query("year", ParseIntPipe) year:number){
    console.log(year)
    const userGrowth = await this.userService.getUserGrowth(year)

    return userGrowth
  }

 

  @Patch()
  async updadeUser(@Body() updateData: UpdateUserDto, @Req() request: Request) {
    const user = request['user'];

    const updatedUser = await this.userService.updateUser(
      user['sub'],
      updateData,
    );

    return updatedUser;
  }

  @Patch('password')
  async updatePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @Req() request: Request,
  ) {
    const user = request['user'];
    const updateUserPassword = await this.userService.updatePassword(
     new ObjectId( user.sub),
      changePasswordDto.previousPassword,
      changePasswordDto.newPassword,
    );

    return updateUserPassword;
  }

  @Post('forget-password')
  async forgetPassword(@Body() forgetpasswordDto: ForgetPasswordDto) {
    const response = await this.userService.forgetPassword(forgetpasswordDto);

    return response;
  }

  @Post('verify-otp')
  @ResponseMessage('Otp verified successfully')
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    const response = await this.userService.verifyOtp(
      verifyOtpDto.token,
      verifyOtpDto.code,
    );

    return response
  }

  @Post('reset-password')
  @ResponseMessage('password reset successfully')
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
    @Req() request: Request,
  ) {
    const user = request['user'];

    const response = await this.userService.resetPassword(
      user.sub,
      resetPasswordDto.token,
      resetPasswordDto.newPassword,
    );

    return  response
  }

   @Roles('admin')
  @Get(':id')
  async getUser(@Param('id', ParseIdPipe) id: ObjectId) {

    const user = await this.userService.findOne(id);

    return user;
  }
  
}
