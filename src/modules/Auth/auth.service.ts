import { Injectable, Request, Scope } from "@nestjs/common";
import { UserService } from "../User/user.service";
import { User } from "../User/entities/user.entity";

@Injectable()
export class AuthService {

    constructor(private readonly userService:UserService){}

    register():Promise<User>{
        const createdUser = this.userService.craeteUser({fullName:"Sahin", email:"SAHIN@GMAIL.COM", password:"1234"});

        return createdUser
    }

    logIn(email:string, password:string){
        const existingUsre =  this.getUserByEmail(email)

        if(!existingUsre){
            return "User not found"
        }
    }

    getUser (){
        return {name:"Sahin"}
    }

    getUserByEmail(email:string){
        return this.userService.getUserByEmail(email)
    }

}