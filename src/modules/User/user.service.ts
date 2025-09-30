import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {

    constructor(@InjectRepository(User) private readonly userRepository:Repository<User>){}

    findAll():Promise<User[]>{
        return this.userRepository.find();
    }

    findOne(id:string):Promise<User | null>{
        return this.userRepository.findOneBy({_id:id} as any);
    }

    craeteUser(user:Partial<User>):Promise<User>{
        const newUser = this.userRepository.create(user);
        
        return this.userRepository.save(newUser);
    }

    getUserByEmail(email:string):Promise<User | null>{
        return this.userRepository.findOneBy({email});
    }

    isUserExist(email:string):Promise<boolean>{
        return this.userRepository.existsBy({email});
    }
}
