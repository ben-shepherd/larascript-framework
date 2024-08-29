import { BulkWriteOptions, UpdateOptions } from "mongodb";
import { IDatabaseDriver } from "../interfaces/IDatabaseDriver";
import { IDatabaseDocument, IDatabaseQuery } from "../interfaces/IDatabaseQuery";

class DatabaseQuery implements IDatabaseQuery
{
    protected driver!: IDatabaseDriver;
    protected tableName!: string;

    constructor(driver: IDatabaseDriver)
    {
        this.driver = driver;
    }

    table(table: string): IDatabaseQuery
    {
        this.tableName = table;
        return this;
    } 

    findOne<T>(filter?: object): Promise<T | null> {
        throw new Error("Method not implemented.");
    }

    findMany<T>(filter?: object): Promise<T[]> {
        throw new Error("Method not implemented.");
    }

    insertOne<T>(doc: IDatabaseDocument): Promise<T> {
        throw new Error("Method not implemented.");
    }

    insertMany<T>(docs: IDatabaseDocument[], options?: BulkWriteOptions): Promise<T> {
        throw new Error("Method not implemented.");
    }

    updateOne<T>(doc: IDatabaseDocument, options?: UpdateOptions): Promise<T> {
        throw new Error("Method not implemented.");
    }

    updateMany<T>(docs: IDatabaseDocument[], options?: UpdateOptions): Promise<T> {
        throw new Error("Method not implemented.");
    }

    deleteOne<T>(filter: object): Promise<T> {
        throw new Error("Method not implemented.");
    }

    deleteMany<T>(filter: object): Promise<T> {
        throw new Error("Method not implemented.");
    }
}

export default DatabaseQuery