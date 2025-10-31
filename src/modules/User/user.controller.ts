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
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Roles } from 'src/common/decorators/role.decorator';
import { UpdateUserDto } from './dtos/update-user.dto';
import { ChangePasswordDto } from './dtos/change-password.dto';
import { ForgetPasswordDto } from './dtos/forget-password.dto';
import { VerifyOtpDto } from './dtos/verify-otp.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { ParseIdPipe } from 'src/common/pipes/parseIdPipe';
import { GetUserDto } from './dtos/get-user.dto';
import { ResponseMessage } from 'src/common/decorators/apiResponseMessage.decorator';
import { RolesEnum } from './enums/role.enum';
import { AddAddressDto } from './dtos/add-address.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ObjectId } from 'mongodb';

@Controller('users')
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

  @Get("avatar")
  async getUserAvatar(@Req() request:Request){
    const user = request['user']
    const avatar = await this.userService.getAvatar(new ObjectId(user.sub as string))
    return avatar
  }
 

  @Patch()
  async updateUser(@Body() updateData: UpdateUserDto, @Req() request: Request) {
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
     new ObjectId( user.sub as string),
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

  @Patch("add-address")
  async addOrEditAddress(@Req() request:Request, @Body() addressDto:AddAddressDto){
    const user = request['user']

    const result = await this.userService.addOrEditAddress(new ObjectId(user.sub) , addressDto.address)

    return result
  } 

  @UseInterceptors(FileInterceptor("avatar",{
    
     limits:{files:1},
    
     storage:diskStorage({
      destination:"./uploads/avatar",
      filename:(req, file, cb)=> {
        cb(null, file.originalname)
      }
     })
  }))

  @Post("avatar")
  async uploadAvatar(@Req() request:Request, @UploadedFile() avatar:Express.Multer.File){
    const user = request['user']
    const result = await this.userService.uploadAvatar(user.sub, avatar)
  
    return result
  }
  
}
