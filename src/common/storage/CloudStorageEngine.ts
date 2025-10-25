import { Request } from "express";
import { Storage } from "./storage.interface";
import { FileUploader } from "../providers/FileUploader.interface";

export class CloudStorageEngine implements Storage{

    constructor(private readonly fileUploader:FileUploader){}

    public __handleFile(req:Request, file:Express.Multer.File, cb:any):void{
        this.fileUploader.upload(file)
        .then(value => {
            cb(null, {key:value.key, location:value.location})
        })
        .catch(err => cb(err))
    }

    public __removeFile(req:Request, file:Express.Multer.File, cb:any):void{

    }

}