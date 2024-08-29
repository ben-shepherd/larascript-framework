import { BulkWriteOptions, UpdateOptions } from "mongodb";

export interface IDatabaseQuery {
    table(table: string): IDatabaseQuery;

    
    findOne<T>(filter?: object): Promise<T | null>;
    findMany<T>(filter?: object): Promise<T[]>;
    
    insertOne<T>(doc: IDatabaseDocument): Promise<T>;
    insertMany<T>(docs: IDatabaseDocument[], options?: BulkWriteOptions): Promise<T>;
    
    updateOne<T>(doc: IDatabaseDocument, options?: UpdateOptions): Promise<T>;
    updateMany<T>(docs: IDatabaseDocument[], options?: UpdateOptions): Promise<T>;
    
    deleteOne<T>(filter: object): Promise<T>;
    deleteMany<T>(filter: object): Promise<T>;
}

export interface IDatabaseDocument {
    _id?: any;
    [key: string]: any;
}