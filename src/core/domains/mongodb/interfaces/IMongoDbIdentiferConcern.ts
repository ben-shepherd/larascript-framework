/* eslint-disable no-unused-vars */
import { IDatabaseDocument } from "@src/core/domains/database/interfaces/IDocumentManager";
import { ObjectId } from "mongodb";

export interface IMongoDbIdentiferConcern {

    convertToObjectId(id: string | ObjectId): ObjectId;

    convertObjectIdToStringInDocument(document: IDatabaseDocument): IDatabaseDocument;
    
}