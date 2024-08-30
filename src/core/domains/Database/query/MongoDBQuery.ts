import DatabaseQuery from "@src/core/domains/database/base/DatabaseQuery";
import MongoDB from "@src/core/domains/database/drivers/MongoDB";
import { IDatabaseDocument } from "@src/core/domains/database/interfaces/IDatabaseQuery";
import { BulkWriteOptions, ObjectId, UpdateOptions } from "mongodb";
import { IBelongsToCtor } from "../interfaces/relationships/IBelongsTo";
import { IHasManyCtor } from "../interfaces/relationships/IHasMany";
import MongoDBBelongsTo from "../relationships/mongodb/MongoDBBelongsTo";
import MongoDBHasMany from "../relationships/mongodb/MongoDBHasMany";

class MongoDBQuery extends DatabaseQuery
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
     * @param doc 
     * @returns 
     */
    protected convertObjectIdToStringInDocument(doc: IDatabaseDocument): IDatabaseDocument
    {
        if('_id' in doc && doc._id instanceof ObjectId) {
            doc = { ...doc, id: doc._id.toString() }
            delete doc._id
        }

        return doc
    }

    /**
     * Find document by _id
     * 
     * @param id 
     * @returns 
     */
    async findById<T = IDatabaseDocument>(id: string): Promise<T | null> {
        return this.findOne({ _id: this.convertStringIdToObjectId(id) })
    }

    /**
     * Find a single document
     * 
     * @param filter 
     * @returns 
     */
    async findOne<T>(filter: object = {}): Promise<T | null> {
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
    async findMany<T>(filter: object = {}): Promise<T[]> {
        let documents = await this.driver.getDb().collection(this.tableName).find(filter).toArray() as T[];

        return documents.map((d: any) => this.convertObjectIdToStringInDocument(d) as T)
    }

    /**
     * Insert a single document
     * 
     * @param document 
     * @returns 
     */
    async insertOne<T>(document: IDatabaseDocument): Promise<T> {
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
     * @param documents 
     * @param options 
     * @returns 
     */
    async insertMany<T>(documents: IDatabaseDocument[],  options?: BulkWriteOptions): Promise<T[]> {
        /**
         * Insert the documents
         */
        await this.driver.getDb().collection(this.tableName).insertMany(documents, options);
        /**
         * After the document is inserted, MongoDB will automatically add `_id: ObjectId` to the document object.
         * We will need to convert this to our standard `id: string` format
         */
        return documents.map((d: IDatabaseDocument) => this.convertObjectIdToStringInDocument(d) as T)
    }

    /**
     * Update a single document
     * 
     * @param doc 
     * @param options 
     * @returns 
     */
    async updateOne<T>(doc: IDatabaseDocument, options?: UpdateOptions): Promise<T> {
        return await this.driver.getDb().collection(this.tableName).updateOne({ _id: this.convertStringIdToObjectId(doc.id) }, { $set: doc }, options) as T
    }
    
    /**
     * Update multiple documents
     * 
     * @param docs 
     * @param options 
     * @returns 
     */
    async updateMany<T>(docs: IDatabaseDocument[], options?: UpdateOptions): Promise<T> {
        return docs.forEach(async (doc) => {
            return await this.updateOne(doc, options)
        }) as T
    }

    /**
     * Delete a single document
     * 
     * @param doc 
     * @returns 
     */
    async deleteOne<T>(doc: IDatabaseDocument): Promise<T> {
        return await this.driver.getDb().collection(this.tableName).deleteOne({ _id: this.convertStringIdToObjectId(doc.id) }) as T
    }

    /**
     * Delete multiple documents
     * 
     * @param docs 
     * @returns 
     */
    async deleteMany<T>(docs: IDatabaseDocument[]): Promise<T> {
        return docs.forEach(async (doc) => {
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
     * - Some database providers may need handle relationships in a different way, 
     *   this method can be used to handle them per database provider
     * 
     * 
     * @returns 
     */
    belongsToCtor(): IBelongsToCtor {
        return MongoDBBelongsTo
    }

    hasManyCtor(): IHasManyCtor {
        return MongoDBHasMany
    }
}

export default MongoDBQuery