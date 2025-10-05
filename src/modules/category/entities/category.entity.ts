import { BaseEntity } from "src/common/entities/base.entity";
import { Column, Entity } from "typeorm";

@Entity({
    name:'categories'
})
export class Category extends BaseEntity {

    @Column()
    name:string
    
    @Column()
    image:string

}