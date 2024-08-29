import { BulkWriteOptions, UpdateOptions } from "mongodb";
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

    async updateOne<T>(docs: IDatabaseDocument, options?: UpdateOptions): Promise<T> {
        return await this.driver.getDb().collection(this.tableName).updateOne({ _id: docs._id }, { $set: docs }, options) as T
    }
    
    async updateMany<T>(docs: IDatabaseDocument[], options?: UpdateOptions): Promise<T> {
        return docs.forEach(async (doc) => {
            return await this.updateOne(doc, options)
        }) as T
    }

    async deleteOne<T>(filter: object): Promise<T> {
        return await this.driver.getDb().collection(this.tableName).deleteOne(filter) as T
    }

    async deleteMany<T>(filter: object): Promise<T> {
        return await this.driver.getDb().collection(this.tableName).deleteMany(filter) as T
    }
}

export default MongoDBQuery