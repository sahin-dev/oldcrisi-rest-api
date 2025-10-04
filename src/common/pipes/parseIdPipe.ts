import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";
import { ObjectId } from "mongodb";

@Injectable()
export class ParseIdPipe implements PipeTransform{
    
    transform(value: string, metadata: ArgumentMetadata) {
        
        return new ObjectId(value)
    }
    
}