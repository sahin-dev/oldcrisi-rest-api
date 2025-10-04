import { SetMetadata } from "@nestjs/common"

export const ApiResponseKey = 'apiResponse'

export const ApiResponse = (message:string) => SetMetadata(ApiResponseKey, message)