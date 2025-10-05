import { OmitType } from "@nestjs/mapped-types";
import { CreateUserDto } from "./create-user.dto";
import { ObjectId } from "mongodb";
import { Exclude, Expose, Transform } from "class-transformer";

export class GetUserDto extends OmitType(CreateUserDto, ['password']) {

    @Transform(({ obj }) => obj._id?.toString())
	_id:ObjectId

    @Expose()
    fullName: string;

    phone: string;

    @Exclude()
    password: string;
}