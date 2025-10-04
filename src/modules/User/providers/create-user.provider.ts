import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dtos/create-user.dto';
import { MongoRepository } from 'typeorm';
import { User } from '../entities/user.entity';

export class CreateUserService {
  constructor(private readonly userRepository: MongoRepository<User>) {}

  createUser(createUserDto: CreateUserDto) {}
}
