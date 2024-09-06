import { IDatabaseDocument } from "@src/core/domains/database/interfaces/IDocumentManager";
import { IBelongsToOptions } from "@src/core/domains/database/interfaces/relationships/IBelongsTo";
import MongoDB from "@src/core/domains/database/providers-db/MongoDB";
import MongoDBBelongsTo from "@src/core/domains/database/relationships/mongodb/MongoDBBelongsTo";
import { BulkWriteOptions, ObjectId, UpdateOptions } from "mongodb";
import BaseDocumentManager from "../base/BaseDocumentManager";
import InvalidObjectId from "../exceptions/InvalidObjectId";

class MongoDbDocumentManager extends BaseDocumentManager<MongoDbDocumentManager, MongoDB> {
    protected driver!: MongoDB;

    constructor(driver: MongoDB) {
        super(driver);
        this.driver = driver;
    }

    /**
     * Removes `id` and `_id` from document
     * @param document 
     * @param fields 
     * @returns 
     */
    protected stripIds(document: IDatabaseDocument, fields: string[] = ['id', '_id']): IDatabaseDocument {
        const data = { ...document }

        fields.forEach((field: string) => {
            if (field in data) {
                delete data[field]
            }
        })
        
        return data
    }

    /**
     * Convert string id to ObjectId
     * 
     * @param id 
     * @returns 
     */
    protected convertToObjectId(id: string | ObjectId): ObjectId {
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
    protected convertObjectIdToStringInDocument(document: IDatabaseDocument): IDatabaseDocument {
        if ('_id' in document && document._id instanceof ObjectId) {
            document = { ...document, id: document._id.toString() }
            delete document._id
        }

        return document
    }

    /**
     * Find document by _id
     * 
     * @param id 
     * @returns 
     */
    async findById<T = IDatabaseDocument>(id: string): Promise<T | null> {
        try {
            return this.findOne({ filter: { _id: this.convertToObjectId(id) } })
        }
        catch (err) {
            if (!(err instanceof InvalidObjectId)) {
                throw err
            }
        }
        return null
    }

    /**
     * Find a single document
     * 
     * @param filter 
     * @returns 
     */
    async findOne<T>({ filter = {} }: { filter?: object }): Promise<T | null> {
        let document = await this.driver.getDb().collection(this.getTable()).findOne(filter) as T | null;

        if (document) {
            document = this.convertObjectIdToStringInDocument(document) as T;
        }

        return document
    }

    /**
     * Find multiple documents
     * 
     * @param filter 
     * @returns 
     */
    async findMany<T>({ filter = {} }: { filter?: object }): Promise<T> {
        let documents = await this.driver.getDb().collection(this.getTable()).find(filter).toArray();

        return documents.map((d: any) => this.convertObjectIdToStringInDocument(d)) as T
    }

    /**
     * Insert a single document
     * 
     * @param document 
     * @returns 
     */
    async insertOne<T>(document: IDatabaseDocument): Promise<T> {
        this.validator.validateSingleDocument(document)
        this.validator.validateWithoutId(document)

        /**
         * Insert the document
         */
        await this.driver.getDb().collection(this.getTable()).insertOne(document);
        /**
         * After the document is inserted, MongoDB will automatically add `_id: ObjectId` to the document object.
         * We will need to convert this to our standard `id: string` format
         */
        return this.convertObjectIdToStringInDocument(document) as T
    }

    /**
     * Insert multiple documents
     * 
     * @param documentsArray 
     * @param options 
     * @returns 
     */
    async insertMany<T>(documentsArray: IDatabaseDocument[], options?: BulkWriteOptions): Promise<T> {
        this.validator.validateMultipleDocuments(documentsArray)
        this.validator.validateWithoutId(documentsArray)

        /**
         * Insert the documents
         */
        await this.driver.getDb().collection(this.getTable()).insertMany(documentsArray, options);
        /**
         * After the document is inserted, MongoDB will automatically add `_id: ObjectId` to the document object.
         * We will need to convert this to our standard `id: string` format
         */
        return documentsArray.map((d: IDatabaseDocument) => this.convertObjectIdToStringInDocument(d)) as T
    }

    /**
     * Update a single document
     * 
     * @param document 
     * @param options 
     * @returns 
     */
    async updateOne<T>(document: IDatabaseDocument, options?: UpdateOptions): Promise<T> {
        this.validator.validateSingleDocument(document)
        this.validator.validateContainsId(document)
        
        const objectId =  this.convertToObjectId(document.id)
        const data = this.stripIds(document)

        await this.driver.getDb().collection(this.getTable()).updateOne({ _id: this.convertToObjectId(document.id) }, { $set: { ...this.stripIds(document)} }, options) as T
        
        return this.convertObjectIdToStringInDocument(document) as T;
    }

    /**
     * Update multiple documents
     * 
     * @param documentsArray 
     * @param options 
     * @returns 
     */
    async updateMany<T>(documentsArray: IDatabaseDocument[], options?: UpdateOptions): Promise<T> {
        this.validator.validateMultipleDocuments(documentsArray)
        this.validator.validateContainsId(documentsArray)

        let documentsUpdated: IDatabaseDocument[] = [];

        for (const document of documentsArray) {
            documentsUpdated.push(await this.updateOne(document, options))
        }

        return documentsUpdated as T
    }

    /**
     * Delete a single document
     * 
     * @param document 
     * @returns 
     */
    async deleteOne<T>(document: IDatabaseDocument): Promise<T> {
        this.validator.validateSingleDocument(document)
        this.validator.validateContainsId(document)

        return await this.driver.getDb().collection(this.getTable()).deleteOne({ _id: this.convertToObjectId(document.id) }) as T
    }

    /**
     * Delete multiple documents
     * 
     * @param documentsArray 
     * @returns 
     */
    async deleteMany<T>(documentsArray: IDatabaseDocument[]): Promise<T> {
        this.validator.validateMultipleDocuments(documentsArray)
        this.validator.validateContainsId(documentsArray)

        return documentsArray.forEach(async (doc) => {
            return await this.deleteOne(doc)
        }) as T
    }

    /**
     * Truncate the collection
     */
    async truncate(): Promise<void> {
        await this.driver.getDb().collection(this.getTable()).deleteMany({})
    }


    async belongsTo<T>(document: IDatabaseDocument, options: IBelongsToOptions): Promise<T | null> {
        return new MongoDBBelongsTo().handle(
            this.driver.connectionName,
            document,
            options
        ) as T ?? null
    }
}

export default MongoDbDocumentManager