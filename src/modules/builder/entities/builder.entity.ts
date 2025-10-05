import { ObjectId } from "mongodb";
import { Entity } from "typeorm";

@Entity({
    name:'builders'
})
export class Builder {

    title:string
    
    icon:string

    items: ObjectId[]

    user:ObjectId
}