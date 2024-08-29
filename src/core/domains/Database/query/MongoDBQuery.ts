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

    async findById<T = IDatabaseDocument>(id: string): Promise<T | null> {
        return await this.driver.getDb().collection(this.tableName).findOne({ _id: this.normalizeId(id) }) as T | null
    }

    async findOne<T>(filter: object = {}): Promise<T | null> {
        return await this.driver.getDb().collection(this.tableName).findOne(filter) as T | null
    }

    async findMany<T>(filter: object = {}): Promise<T[]> {
        return await this.driver.getDb().collection(this.tableName).find(filter).toArray() as T[]
    }

    async insertOne<T>(docs: IDatabaseDocument): Promise<T> {
        return await this.driver.getDb().collection(this.tableName).insertOne(docs) as T
    }

    async insertMany<T>(docs: IDatabaseDocument[],  options?: BulkWriteOptions): Promise<T> {
        return await this.driver.getDb().collection(this.tableName).insertMany(docs, options) as T;
    }

    async updateOne<T>(doc: IDatabaseDocument, options?: UpdateOptions): Promise<T> {
        return await this.driver.getDb().collection(this.tableName).updateOne({ _id: this.normalizeId(doc._id) }, { $set: doc }, options) as T
    }
    
    async updateMany<T>(docs: IDatabaseDocument[], options?: UpdateOptions): Promise<T> {
        return docs.forEach(async (doc) => {
            return await this.updateOne(doc, options)
        }) as T
    }

    async deleteOne<T>(doc: IDatabaseDocument): Promise<T> {
        return await this.driver.getDb().collection(this.tableName).deleteOne({ _id: this.normalizeId(doc._id) }) as T
    }

    async deleteMany<T>(docs: IDatabaseDocument[]): Promise<T> {
        return docs.forEach(async (doc) => {
            return await this.deleteOne(doc)
        }) as T
    }

    async truncate(): Promise<void> {
        await this.driver.getDb().collection(this.tableName).deleteMany({})
    }
}

export default MongoDBQuery