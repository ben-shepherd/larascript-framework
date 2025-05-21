import Controller from "@src/core/domains/http/base/Controller";
import HttpContext from "@src/core/domains/http/context/HttpContext";
import { storage } from "@src/core/domains/storage/services/StorageService";
import { Request } from "express";

class ExampleController extends Controller {

    async fileupload(context: HttpContext) {
        
        const req = context.getRequest() as Request;
        const file = context.getFile('file');

        if (!file) {
            return this.jsonResponse({
                message: 'No file uploaded',
            }, 400)
        }

        const result = await storage().moveUploadedFile(file)

        return this.jsonResponse({
            message: 'File uploaded',
            file: file,
            result: result.toObject()
        }, 200)

    }

}

export default ExampleController;
