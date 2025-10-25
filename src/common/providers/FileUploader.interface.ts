export interface FileUploader{
    upload(file:Express.Multer.File):Promise<any>
}