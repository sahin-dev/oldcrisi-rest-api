import { Injectable } from "@nestjs/common"
import { ObjectId } from "mongodb"
import { Between, ILike } from "typeorm"

@Injectable()
export class SearchFilterProvider {
    private query:Record<string,any> = {}

    public addCategory(category:ObjectId){
        if(!category) return this

        this.query['category'] = category
        return this
    }

   
    public buildQuery(){
        return this.query
    }
}