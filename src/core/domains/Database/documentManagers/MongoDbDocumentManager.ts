import { IDatabaseDocument } from "@src/core/domains/database/interfaces/IDocumentManager";
import { IBelongsToCtor } from "@src/core/domains/database/interfaces/relationships/IBelongsTo";
import { IHasManyCtor } from "@src/core/domains/database/interfaces/relationships/IHasMany";
import MongoDB from "@src/core/domains/database/providers-db/MongoDB";
import MongoDBBelongsTo from "@src/core/domains/database/relationships/mongodb/MongoDBBelongsTo";
import MongoDBHasMany from "@src/core/domains/database/relationships/mongodb/MongoDBHasMany";
import { BulkWriteOptions, ObjectId, UpdateOptions } from "mongodb";
import BaseDocumentManager from "../base/BaseDocumentManager";

class MongoDbDocumentManager extends BaseDocumentManager<MongoDbDocumentManager, MongoDB>
{
    protected driver!: MongoDB;

    constructor(driver: MongoDB) {
        super(driver);
        this.driver = driver;
    }

    /**
     * Convert string id to ObjectId
     * 
     * @param id 
     * @returns 
     */
    protected convertStringIdToObjectId(id: string | ObjectId): ObjectId
    {
        if(id instanceof ObjectId) {
            return id
        }

        if(!ObjectId.isValid(id)) {
            throw new Error('Invalid ObjectId')
        }

        return new ObjectId(id)
    }


    /**
     * Replaces `_id: ObjectId` with `id: string`
     * 
     * @param document 
     * @returns 
     */
    protected convertObjectIdToStringInDocument(document: IDatabaseDocument): IDatabaseDocument
    {
        if('_id' in document && document._id instanceof ObjectId) {
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
        return this.findOne({ filter: { _id: this.convertStringIdToObjectId(id) } })
    }

    /**
     * Find a single document
     * 
     * @param filter 
     * @returns 
     */
    async findOne<T>({filter = {}}: {filter?: object}): Promise<T | null> {
        let document = await this.driver.getDb().collection(this.tableName).findOne(filter) as T | null;

        if(document) {
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
    async findMany<T>({ filter = {} }: {filter?: object}): Promise<T[]> 
    {
        let documents = await this.driver.getDb().collection(this.tableName).find(filter).toArray() as T[];

        return documents.map((d: any) => this.convertObjectIdToStringInDocument(d) as T)
    }

    /**
     * Insert a single document
     * 
     * @param document 
     * @returns 
     */
    async insertOne<T>(document: IDatabaseDocument): Promise<T> 
    {
        this.validator.validateSingleDocument(document)
        this.validator.validateWithoutId(document)

        /**
         * Insert the document
         */
        await this.driver.getDb().collection(this.tableName).insertOne(document);
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
    async insertMany<T>(documentsArray: IDatabaseDocument[],  options?: BulkWriteOptions): Promise<T[]> 
    {
        this.validator.validateMultipleDocuments(documentsArray)
        this.validator.validateWithoutId(documentsArray)
        
        /**
         * Insert the documents
         */
        await this.driver.getDb().collection(this.tableName).insertMany(documentsArray, options);
        /**
         * After the document is inserted, MongoDB will automatically add `_id: ObjectId` to the document object.
         * We will need to convert this to our standard `id: string` format
         */
        return documentsArray.map((d: IDatabaseDocument) => this.convertObjectIdToStringInDocument(d) as T)
    }

    /**
     * Update a single document
     * 
     * @param document 
     * @param options 
     * @returns 
     */
    async updateOne<T>(document: IDatabaseDocument, options?: UpdateOptions): Promise<T> 
    {
        this.validator.validateSingleDocument(document)
        this.validator.validateContainsId(document)

        await this.driver.getDb().collection(this.tableName).updateOne({ _id: this.convertStringIdToObjectId(document.id) }, { $set: document }, options) as T

        return this.convertObjectIdToStringInDocument(document) as T
    }
    
    /**
     * Update multiple documents
     * 
     * @param documentsArray 
     * @param options 
     * @returns 
     */
    async updateMany<T>(documentsArray: IDatabaseDocument[], options?: UpdateOptions): Promise<T> 
    {
        this.validator.validateMultipleDocuments(documentsArray)
        this.validator.validateContainsId(documentsArray)

        let documentsUpdated: IDatabaseDocument[] = [];

        for(const document of documentsArray) {
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
    async deleteOne<T>(document: IDatabaseDocument): Promise<T> 
    {
        this.validator.validateSingleDocument(document)
        this.validator.validateContainsId(document)

        return await this.driver.getDb().collection(this.tableName).deleteOne({ _id: this.convertStringIdToObjectId(document.id) }) as T
    }

    /**
     * Delete multiple documents
     * 
     * @param documentsArray 
     * @returns 
     */
    async deleteMany<T>(documentsArray: IDatabaseDocument[]): Promise<T> 
    {
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
        await this.driver.getDb().collection(this.tableName).deleteMany({})
    }

    /**
     * Returns the BelongsToCtor
     * 
     * @returns 
     */
    belongsToCtor(): IBelongsToCtor {
        return MongoDBBelongsTo
    }

    /**
     * Returns the HasManyCtor
     * 
     * @returns 
     */
    hasManyCtor(): IHasManyCtor {
        return MongoDBHasMany
    }
}

export default MongoDbDocumentManager