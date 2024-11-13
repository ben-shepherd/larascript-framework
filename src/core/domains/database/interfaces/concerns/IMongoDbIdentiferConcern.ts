/* eslint-disable no-unused-vars */
import { ObjectId } from "mongodb";

import { IDatabaseDocument } from "../IDocumentManager";

export interface IMongoDbIdentiferConcern {

    convertToObjectId(id: string | ObjectId): ObjectId;

    convertObjectIdToStringInDocument(document: IDatabaseDocument): IDatabaseDocument;
    
}