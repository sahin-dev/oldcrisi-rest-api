import {
    BadRequestException,
    Body,
    Injectable,
    NotFoundException,
    UseInterceptors,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { MongoRepository } from 'typeorm';
import { RolesEnum } from 'src/modules/User/enums/role.enum';
import { ObjectId } from 'mongodb';
import { UpdateUserDto } from './dtos/update-user.dto';
import { HashingProvider } from '../Auth/providers/AbstractHashing.provider';
import { ForgetPasswordDto } from './dtos/forget-password.dto';
import { SmsProvider } from './providers/sms.provider';
import { OtpVerification } from './entities/otpVerification.entity';
import { OtpStatusEnum } from './enums/otpStatus.enum';
import { OtpTypeEnum } from './enums/otpType.enum';
import resetPassEmailTemp from 'src/common/templates/forget-password';
import { GetUserDto } from './dtos/get-user.dto';
import fs from 'fs'
import path from 'path'
import { plainToInstance } from 'class-transformer';
import { userResponseDto } from './dtos/user-response.dto';

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(User)
        private readonly userRepository: MongoRepository<User>,
        @InjectRepository(OtpVerification)
        private readonly otpRepository: MongoRepository<OtpVerification>,
        private readonly hashingProvider: HashingProvider,
        private readonly smsProvider: SmsProvider,
    ) { }

   

    findAll(): Promise<User[]> {
        return this.userRepository.find();
    }

    async findOne(userId: ObjectId): Promise<userResponseDto | null> {

        const user = await this.userRepository.findOneBy({
            where: { _id: userId },
        
        });

        if (!user) throw new NotFoundException('user not found');

        return this.userToUserDtoMapper(user);
    }
    

    async createUser(createUserDto: Partial<User>): Promise<userResponseDto> {
        const newUser = this.userRepository.create({
            ...createUserDto,
            role: RolesEnum.USER,
        });

        const createdUser = await this.userRepository.save(newUser);

        return this.userToUserDtoMapper(createdUser);
    }



    async getUserByEmail(email: string): Promise<userResponseDto | null> {
        const user =  await this.userRepository.findOne({where:{email}});
        if(!user){
            throw new NotFoundException("user not found")
        } 

        const userMapper =  this.userToUserDtoMapper(user);
        // userMapper._id = user._id
        return userMapper
    }

    
    async isUserExist(email: string): Promise<boolean> {
        const user = await this.userRepository.findOneBy({ where: { email } });

        if (user) return true;

        return false;
    }

    async updateUser(id: string, updateUserDto: UpdateUserDto){
        const objectId = this.getObjectId(id);
        const user = await this.userRepository.findOneBy({
            where: { _id: objectId },
            
        });
    

        if (!user) throw new NotFoundException('User not found');

        const newUser = Object.assign(user, updateUserDto);
        const { password, fcmToken,...savedUser} =  await this.userRepository.save(newUser);

        return savedUser
    }

    async updatePassword(
        id: ObjectId,
        previousPassword: string,
        newPassword: string,
    ): Promise<User> {

        const user = await this.userRepository.findOne({where:{_id:id}});

        if (!user) {
            throw new NotFoundException('user not found');
        }

        const isPasswordMatched = await this.hashingProvider.compare(
            previousPassword,
            user.password,
        );

        if (!isPasswordMatched) {
            throw new BadRequestException('password does not matched');
        }

        const hashedPassword = await this.hashingProvider.hash(newPassword);
        user.password = hashedPassword;

        return await this.userRepository.save(user);
    }



    async forgetPassword(@Body() forgetPasswordDto: ForgetPasswordDto) {
        const user = await this.getUserByEmail(forgetPasswordDto.email);

        if (!user) {
            throw new NotFoundException('User not found');
        }

        const otp = this.generateOtp();
        const otpVerification = this.otpRepository.create({
            email: user.email,
            status: OtpStatusEnum.Valid,
            type: OtpTypeEnum.ForgetPasswordOtp,
            code: otp,
        });
        await this.otpRepository.save(otpVerification);

        this.smsProvider.sendmail(
            user.email,
            'Reset password verfication code',
            resetPassEmailTemp({name:user.fullName, verificationCode: otp, verificationCodeExpire:15}),
        );

        return otpVerification._id;
    }

    async verifyOtp(id: string, code: string) {

        const verificationId = this.getObjectId(id);

        const verification = await this.otpRepository.findOne({
            where: { _id: verificationId },
        });

        if (
            !verification ||
            verification.status === OtpStatusEnum.Invalid ||
            verification.status === OtpStatusEnum.Expired ||
            verification.status === OtpStatusEnum.Verified
        ) {
            throw new BadRequestException('otp invalid or expired');
        }

        if (verification.expiredAT <= new Date(Date.now())) {
            verification.status = OtpStatusEnum.Expired;
            await this.otpRepository.save(verification);

            throw new BadRequestException('otp has expired!');
        }

        if (verification.code !== code) {
            throw new BadRequestException('Otp incorrect!');
        }

        verification.status = OtpStatusEnum.Verified;

        const updatedverification = await this.otpRepository.save(verification);

        return updatedverification;
    }

    //Reset password after verify otp fro forget password

    async resetPassword(userId: ObjectId, verificationId: string, newPassword: string) {

        const user = await this.userRepository.findOne({where:{_id:userId}})

        if (!user) {
            throw new NotFoundException("user not found")
        }

        const verification = await this.otpRepository.findOne({ where: { _id: this.getObjectId(verificationId) } })

        if (!verification) {
            throw new NotFoundException("code not found")
        }

        if (verification.status !== OtpStatusEnum.Verified) {
            throw new BadRequestException("otp is not verified")
        }

        const hashedpassword = await this.hashingProvider.hash(newPassword)
        user.password = hashedpassword
        verification.status = OtpStatusEnum.Invalid
        verification.expiredAT = new Date(Date.now())

        await this.userRepository.save(user)

        await this.otpRepository.save(verification)

        return "password reset successfully"

    }

    async deleteUser(userId: ObjectId, password: string) {
        const user = await this.userRepository.findOne({where:{_id:userId}})

        if(!user){
            throw new NotFoundException("user not found!")
        }

        const isEqual = await this.hashingProvider.compare(password, user.password)
        if(!isEqual){
            throw new BadRequestException("password does not matched")
        }

        user.isDeleted = true

        await this.userRepository.save(user)
        
        return user

    }

    private generateOtp() {
        const otp = Math.floor(Math.random() * 900000) + 100000;
        return otp.toString();
    }

    private getObjectId(id: string): ObjectId {
        return new ObjectId(id);
    }

    async updateUserPoint(userId:ObjectId, point:number){
        
        const user = await this.userRepository.findOne({where:{_id:userId}})

        if(!user){
            throw new NotFoundException("User not found")
        }
        user.point+=point
        
        const updatedUser = await  this.userRepository.save(user );

        return this.userToUserDtoMapper(updatedUser)
    }

     async getUserGrowth(year:number){
        const start = new Date(year, 0, 1);
        const end = new Date(year + 1, 0, 1);

        const pipeline = [
            { $match: { createdAt: { $gte: start, $lt: end } } },
            { $group: { _id: { $month: "$createdAt" }, count: { $sum: 1 } } },
            { $sort: { _id: 1 } },
        ];

        const cursor = this.userRepository.aggregate(pipeline);
        const results: Array<{ _id: number; count: number }> = await cursor.toArray();

        const months = Array.from({ length: 12 }, (_, i) => ({ month: i + 1, count: 0 }));
        results.forEach(r => {
            if (r._id >= 1 && r._id <= 12) {
                months[r._id - 1].count = r.count;
            }
        });

        return months; 
    }

    async updateUserFcmToken(userId:ObjectId, token:string){
        const user =await this.userRepository.findOne({where:{_id:userId}})

        if(!user){
            throw new NotFoundException("User not found")
        }

        await this.userRepository.update(user._id, {fcmToken:token})
    }

    async addOrEditAddress(userId:ObjectId, address:string){
        const user = await this.userRepository.findOne({where:{_id:userId}})

        if(!user){
            throw new NotFoundException("User not found")
        }

        const {password, fcmToken, ...sanitizedUser} = user

        sanitizedUser.address = address

         await this.userRepository.save(user)
         return sanitizedUser
    }


    async getAvatar(userId:ObjectId){
        const user = await this.userRepository.findOne({where:{_id:userId}})

        if(!user){
            throw new NotFoundException("user not found")
        }
        const resolvedPath = path.resolve(user.avatar)
        if(!fs.existsSync(resolvedPath)){
            return null
        }

        return user.avatar
    }

    async uploadAvatar(userId:ObjectId, file:Express.Multer.File){
        
        const user = await this.userRepository.findOne({where:{_id:new ObjectId(userId)}})

        if(!user){
            throw new NotFoundException("User not found")
        }


        if(user.avatar){

            try{
                await this.deleteImage(user.avatar)
            }catch(err){
                console.log(err)
            }
        }

        user.avatar = file.path

        const updatedUser = await this.userRepository.save(user)

        return this.userToUserDtoMapper(updatedUser)
    }



     private deleteImage(imagePath:string):Promise<void>{
    
            return new Promise(( resolve, reject) => {
                const resolvedPath = path.resolve(imagePath)
                if(fs.existsSync(resolvedPath)){
                    fs.rm(resolvedPath, (err)=>{
                        if(err)
                            reject(new Error("Error deleting file"))
                        resolve()
                    })
                }else{
                    reject(new Error("File is not exist!"))
                }
            })
    
        }
        async getUserEncryptedPassword(userId:ObjectId){
            console.log("userId", userId)
            const user = await this.userRepository.findOne({where:{_id:userId}})

            if(!user){
                throw new NotFoundException("User not found!")
            }

            return user.password
        }

        private userToUserDtoMapper(user:User){

            return plainToInstance(userResponseDto, user, {
                excludeExtraneousValues:true,
                
            })
        }
}
