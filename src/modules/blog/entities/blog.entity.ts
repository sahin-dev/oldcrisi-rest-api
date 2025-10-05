import { BaseEntity } from "src/common/entities/base.entity";
import { BeforeInsert, Column, Entity } from "typeorm";

@Entity({
    name:'blogs'
})
export class Blog extends BaseEntity{

    @Column()
    title:string

    @Column()
    headerImage:string

    @Column()
    content :string

    @Column()
    reads :number

    @Column()
    slug:string

    constructor(){
        super()

        this.reads = 0
    }

    @BeforeInsert()
    setSlug(){
        if(this.title){
            this.slug = this.title.toLowerCase().split(' ').join('-')
        }
    }

    

}