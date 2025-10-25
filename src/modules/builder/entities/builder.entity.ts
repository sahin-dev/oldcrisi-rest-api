import { ObjectId } from "mongodb";
import { BaseEntity } from "src/common/entities/base.entity";
import { Column, Entity } from "typeorm";

@Entity({
    name:'builders'
})
export class Builder  extends BaseEntity{

    @Column()
    title:string
    
    @Column()
    icon:string

    @Column()
    items: ObjectId[]

    @Column()
    user:ObjectId
}