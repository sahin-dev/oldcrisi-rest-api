import { ObjectId } from "mongodb";
import { BaseEntity } from "src/common/entities/base.entity";
import { Column, Entity } from "typeorm";

@Entity({
    name:'products'
})
export class Product extends BaseEntity{

    @Column()
    user:ObjectId

    @Column()
    title:string

    @Column()
    name:string

    @Column()
    createdBy:string

    @Column()
    category:ObjectId

    @Column()
    price: number

    @Column()
    description:string

    @Column()
    swappable:boolean

    @Column()
    images:string[]
}