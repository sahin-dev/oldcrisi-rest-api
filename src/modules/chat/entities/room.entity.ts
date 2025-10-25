import { ObjectId } from "mongodb";
import { BaseEntity } from "src/common/entities/base.entity";
import { Column, Entity } from "typeorm";

@Entity({
    name:"rooms"
})
export class Room  extends BaseEntity{

    @Column()
    user1:ObjectId

    @Column()
    user2:ObjectId

}