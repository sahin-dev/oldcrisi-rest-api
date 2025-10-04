import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../User/user.service';
import { User } from '../User/entities/user.entity';
import { CreateUserDto } from '../User/dtos/create-user.dto';
import { HashingProvider } from './providers/AbstractHashing.provider';
import { JwtService } from '@nestjs/jwt';
import { type ConfigType } from '@nestjs/config';
import jwtConfig from 'src/config/jwt.config';
import { ObjectId } from 'typeorm';


@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,

    private readonly hashingProvider: HashingProvider,

    private readonly jwtService: JwtService,

    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<User> {
    const exitstingUser = await this.userService.getUserByEmail(
      createUserDto.email,
    );
    if (exitstingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await this.hashingProvider.hash(
      createUserDto.password,
    );

    const createdUser = this.userService.craeteUser({
      fullName: createUserDto.fullName,
      email: createUserDto.email,
      password: hashedPassword,
    });

    return createdUser;
  }

  async signIn(email: string, password: string) {
    const existingUser = await this.userService.getUserByEmail(email);
    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    const isPasswordMatching = await this.hashingProvider.compare(
      password,
      existingUser.password,
    );

    if (!isPasswordMatching) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = await this.jwtService.signAsync(
      {
        sub: existingUser._id,
        email: existingUser.email,
        role: existingUser.role,
      },
      {
        secret: this.jwtConfiguration.jwt_secret,
        audience: this.jwtConfiguration.jwt_token_audience,
        issuer: this.jwtConfiguration.jwt_token_issuer,
        expiresIn: this.jwtConfiguration.jwt_token_ttl,
      },
    );

    return { ...existingUser, accessToken: token };
  }

  async getAuthenticatedUser(userId: ObjectId) {

    const user = await this.userService.findOne(userId);

    if (!user) throw new NotFoundException('User not found');

    return user;
  }
}
