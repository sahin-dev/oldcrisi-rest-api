import { ObjectId } from "mongodb";
import { BaseEntity } from "src/common/entities/base.entity";
import { Column, Entity } from "typeorm";

@Entity({
    name:'favourites'
})
export class Favourite extends BaseEntity{

    @Column()
    user:ObjectId

    @Column()
    product:ObjectId
}