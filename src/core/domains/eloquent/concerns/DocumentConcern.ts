import { ICtor } from "@src/core/interfaces/ICtor";
import { generateUuidV4 } from "@src/core/util/uuid/generateUuidV4";

const DocumentConcernMixin = (Base: ICtor) => {
    return class DocumentConcern extends Base {
        
        /**
         * Adds the id: uuid to the document
         * @param document The document to add an id to
         * @returns The document with an id added
         */
        documentWithUuid<T>(document: T): T {
            return {
                ...document,
                id: generateUuidV4()
            }
        }

        /**
         * Removes undefined properties from the document
         * @param document The document to clean
         * @returns The cleaned document
         */
        documentStripUndefinedProperties<T>(document: T): T {
            for (const key in document) {
                if (document[key] === undefined) {
                    delete document[key]
                }
            }
            return document
        }
    
    }
}

export default DocumentConcernMixin