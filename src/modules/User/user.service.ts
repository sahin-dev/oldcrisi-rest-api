import {
    BadRequestException,
    Body,
    Injectable,
    NotFoundException,
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

    async findOne(userId: ObjectId): Promise<User | null> {

        const user = await this.userRepository.findOneBy({
            where: { _id: userId },
            
        });

        if (!user) throw new NotFoundException('user not found');

        return user;
    }
    

    craeteUser(createUserDto: Partial<User>): Promise<User> {
        const newUser = this.userRepository.create({
            ...createUserDto,
            role: RolesEnum.USER,
        });

        return this.userRepository.save(newUser);
    }

    getUserByEmail(email: string): Promise<User | null> {
        return this.userRepository.findOneBy({ email });
    }

    async isUserExist(email: string): Promise<boolean> {
        const user = await this.userRepository.findOneBy({ where: { email } });

        if (user) return true;

        return false;
    }

    async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User> {
        const objectId = this.getObjectId(id);
        const user = await this.userRepository.findOneBy({
            where: { _id: objectId },
        });

        if (!user) throw new NotFoundException('User not found');

        Object.assign(user, updateUserDto);
        return await this.userRepository.save(user);
    }

    async updatePassword(
        id: ObjectId,
        previousPassword: string,
        newPassword: string,
    ): Promise<User> {

        const user = await this.findOne(id);

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

        const user = await this.findOne(userId)

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
        const user = await this.findOne(userId)

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

    getObjectId(id: string): ObjectId {
        return new ObjectId(id);
    }
}
