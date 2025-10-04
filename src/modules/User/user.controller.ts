import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
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

@Controller('users/')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Roles('admin')
  async getAllUsers() {
    return this.userService.findAll();
  }

  @Roles('admin')
  @Get(':id')
  async getUser(@Param('id', ParseIdPipe) id: ObjectId) {

    const user = await this.userService.findOne(id);

    return user;
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
      user.sub,
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
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    const response = await this.userService.verifyOtp(
      verifyOtpDto.token,
      verifyOtpDto.code,
    );

    return { message: 'Otp verified successfully', data: response };
  }

  @Post('reset-password')
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

    return { message: 'password reset successfully', data: response };
  }
}
