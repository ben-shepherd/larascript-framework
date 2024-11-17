import InvalidObjectId from "@src/core/domains/database/exceptions/InvalidObjectId";
import { IDatabaseDocument } from "@src/core/domains/database/interfaces/IDocumentManager";
import { ObjectId } from "mongodb";

class MongoDbIdentiferConcern {

    /**
     * Convert string id to ObjectId
     * 
     * @param id 
     * @returns 
     */
    convertToObjectId(id: string | ObjectId): ObjectId {
        if (id instanceof ObjectId) {
            return id
        }

        if (!ObjectId.isValid(id)) {
            throw new InvalidObjectId(`Invalid ObjectId: ${id}`)
        }

        return new ObjectId(id)
    }

    /**
     * Replaces `_id: ObjectId` with `id: string`
     * 
     * @param document 
     * @returns 
     */
    convertObjectIdToStringInDocument(document: IDatabaseDocument): IDatabaseDocument {
        if ('_id' in document && document._id instanceof ObjectId) {
            document = { ...document, id: document._id.toString() }
            delete document._id
        }

        return document
    }

}

export default MongoDbIdentiferConcern