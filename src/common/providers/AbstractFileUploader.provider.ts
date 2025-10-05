export abstract class AbstractFileUploader{
    abstract upload(file:Express.Multer.File):string
}