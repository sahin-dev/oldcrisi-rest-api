import { Module } from "@nestjs/common"
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { UserModule } from "../User/user.module";


@Module({
    imports:[UserModule],
    controllers:[AuthController],
    providers:[AuthService]
})
export class  AuthModule {}