import { AbstractFileUploader } from "./AbstractFileUploader.provider";

export class InMemoryFileUploader extends AbstractFileUploader{
    
    upload(file: Express.Multer.File): string {
        throw new Error("Method not implemented.");
    }
    
}