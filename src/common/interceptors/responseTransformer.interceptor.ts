import { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Response } from "express";
import { map, Observable } from "rxjs";
import { ApiResponseKey } from "../decorators/apiResponseMessage.decorator";

export interface ApiResponse<T> {
    success:true,
    message:string,
    statusCode:string,
    data:T
}

export class ResponseTransformerInterceptor<T> implements NestInterceptor<T, ApiResponse<T>>{
   constructor( private readonly reflector:Reflector){}

    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        
         const apiResponseMessage = this.reflector.getAllAndOverride(ApiResponseKey, [context.getClass(), context.getHandler()])

        return next.handle().pipe(
            map(data => {
                const response = context.switchToHttp().getResponse<Response>()
      
                const code = response.statusCode
                return {
                    success:true,
                    statusCode:code,
                    message:apiResponseMessage,
                    data: data           
                }
                
            })
        )
    }
    
}