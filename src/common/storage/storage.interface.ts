import { Request } from "express"

export interface Storage{
    __handleFile(req:Request, file:Express.Multer.File, cb:any):void
    __removeFile(req:Request, file:Express.Multer.File, cb:any):void
}