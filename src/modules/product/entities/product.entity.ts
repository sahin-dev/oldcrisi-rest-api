import { ObjectId } from "mongodb";
import { BaseEntity } from "src/common/entities/base.entity";
import { Column, Entity } from "typeorm";



@Entity({
    name:'product_variants'
})
export class ProductVariant extends BaseEntity{

    @Column()
    product:ObjectId

    @Column()
    size:string

    @Column()
    price:number

    @Column()
    stock:number

    
}

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
    description:string

    @Column()
    swappable:boolean

    @Column()
    images:string[]
    
}
