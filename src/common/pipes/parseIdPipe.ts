import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import { ObjectId } from "mongodb";

@Injectable()
export class ParseIdPipe implements PipeTransform{
    
    transform(value: string, metadata: ArgumentMetadata) {
        try{
            const castObjectId =  new ObjectId(value)
            return castObjectId
        }catch(err){
            throw new BadRequestException("Object id malformed")
        }
        
    }
    
}