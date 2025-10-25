import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Request } from "express";

export const PaginationQuery  = createParamDecorator(
    (data:unknown, ctx:ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest<Request>()
        console.log(data)
        const query = request.query

        return {
            page: Number(query.page) || 1 ,
            limit: Number(query.limit) || 10
        }
    }
)