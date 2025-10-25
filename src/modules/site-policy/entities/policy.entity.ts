import { BaseEntity } from "src/common/entities/base.entity";
import { Column, Entity } from "typeorm";
import { PolicyEnum } from "../enums/PolicyEnum";

@Entity({
    name:'policies'
})
export class Policy extends BaseEntity{

    @Column()
    content:string

    @Column()
    type:PolicyEnum

}