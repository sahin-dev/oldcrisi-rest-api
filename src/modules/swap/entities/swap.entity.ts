
import { ObjectId } from "mongodb";
import { BaseEntity } from "src/common/entities/base.entity";
import { Column, Entity } from "typeorm";
import { SwapStatusEnum } from "../enums/swapStatus.enum";

@Entity({
    name:'swaps'
})
export class Swap extends BaseEntity{
    
    @Column()
    userFrom :ObjectId  

    @Column()
    productFrom:ObjectId

    variantFrom:ObjectId

    @Column()
    userTo:ObjectId

    @Column()
    productTo:ObjectId

    variantTo:ObjectId

    @Column()
    status:SwapStatusEnum
    

}