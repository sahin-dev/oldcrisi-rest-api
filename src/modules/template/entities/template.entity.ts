import { BaseEntity } from "src/common/entities/base.entity"
import { Column, Entity } from "typeorm"


@Entity({name:"templates"})
export class Template extends BaseEntity{

    @Column()
    title:string

    @Column()
    image:string
    @Column()
    price:number
}