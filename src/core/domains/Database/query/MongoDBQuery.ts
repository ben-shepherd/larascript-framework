import { BulkWriteOptions, ObjectId, UpdateOptions } from "mongodb";
import DatabaseQuery from "../base/DatabaseQuery";
import { IDatabaseDocument, IDatabaseQuery } from "../interfaces/IDatabaseQuery";
import MongoDBDriver from "../services/mongodb/MongoDBDriver";

class MongoDBQuery extends DatabaseQuery
{
    protected driver!: MongoDBDriver;

    constructor(driver: MongoDBDriver) {
        super(driver);
        this.driver = driver;
    }

    collection(coll: string): IDatabaseQuery
    {
        return this.table(coll)
    }

    /**
     * Normalize the id by converting it to an ObjectId
     * 
     * @param id 
     * @returns 
     */
    protected normalizeId(id: string | ObjectId): ObjectId
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
     * Normalize the filter by normalizing _id
     * 
     * @param filter 
     * @returns 
     */
    protected normalizefilter(filter: object): object
    {
        if('_id' in filter && typeof filter._id === 'string') {
            filter = { ...filter, _id: this.normalizeId(filter._id) }
        }

        return filter
    }

    /**
     * Find document by _id
     * 
     * @param id 
     * @returns 
     */
    async findById<T = IDatabaseDocument>(id: string): Promise<T | null> {
        return await this.driver.getDb().collection(this.tableName).findOne({ _id: this.normalizeId(id) }) as T | null
    }

    /**
     * Find a single document
     * 
     * @param filter 
     * @returns 
     */
    async findOne<T>(filter: object = {}): Promise<T | null> {
        return await this.driver.getDb().collection(this.tableName).findOne(this.normalizefilter(filter)) as T | null
    }

    /**
     * Find multiple documents
     * 
     * @param filter 
     * @returns 
     */
    async findMany<T>(filter: object = {}): Promise<T[]> {
        return await this.driver.getDb().collection(this.tableName).find(filter).toArray() as T[]
    }

    /**
     * Insert a single document
     * 
     * @param docs 
     * @returns 
     */
    async insertOne<T>(docs: IDatabaseDocument): Promise<T> {
        return await this.driver.getDb().collection(this.tableName).insertOne(docs) as T
    }

    /**
     * Insert multiple documents
     * 
     * @param docs 
     * @param options 
     * @returns 
     */
    async insertMany<T>(docs: IDatabaseDocument[],  options?: BulkWriteOptions): Promise<T> {
        return await this.driver.getDb().collection(this.tableName).insertMany(docs, options) as T;
    }

    /**
     * Update a single document
     * 
     * @param doc 
     * @param options 
     * @returns 
     */
    async updateOne<T>(doc: IDatabaseDocument, options?: UpdateOptions): Promise<T> {
        return await this.driver.getDb().collection(this.tableName).updateOne({ _id: this.normalizeId(doc._id) }, { $set: doc }, options) as T
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
        return await this.driver.getDb().collection(this.tableName).deleteOne({ _id: this.normalizeId(doc._id) }) as T
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
}

export default MongoDBQuery