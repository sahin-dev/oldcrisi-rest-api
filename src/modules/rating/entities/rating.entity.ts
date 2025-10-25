import { ObjectId } from "mongodb";
import { BaseEntity } from "src/common/entities/base.entity";
import { Column, Entity } from "typeorm";

@Entity({
    name:'ratings'
})
export class Rating extends BaseEntity{

    @Column()
    user:ObjectId

    @Column()
    supplier:ObjectId

    @Column()
    order:ObjectId

    @Column()
    point:number

}