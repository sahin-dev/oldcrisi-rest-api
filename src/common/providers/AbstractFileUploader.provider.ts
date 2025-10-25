import { FileUploader } from "./FileUploader.interface";

export abstract class AbstractFileUploader implements FileUploader{
    abstract upload(file:Express.Multer.File):Promise<any>
}