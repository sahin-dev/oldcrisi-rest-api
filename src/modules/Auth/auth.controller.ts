import { Controller, Get, Inject } from "@nestjs/common";
import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {

    constructor (@Inject() private readonly authService:AuthService){}

    @Get("register")
    async register(){
        return await this.authService.register()
    }

    @Get("login")
    login(){
        return this.authService.logIn("abc@email.com", "12345")
    }

    @Get()
    get(){
        return this.authService.getUser()
    }

}