import { IBelongsToCtor } from "@src/core/domains/database/interfaces/relationships/IBelongsTo";
import { IHasManyCtor } from "@src/core/domains/database/interfaces/relationships/IHasMany";

export interface IDocumentManager {
    table(table: string): IDocumentManager;
    
    findById<T>(id: string): Promise<T | null>;
    findOne<T>(...args: any[]): Promise<T | null>;
    findMany<T>(...args: any[]): Promise<T[]>;
    
    insertOne<T>(doc: IDatabaseDocument, ...args: any[]): Promise<T>;
    insertMany<T>(docs: IDatabaseDocument[], ...args: any[]): Promise<T[]>;
    
    updateOne<T>(doc: IDatabaseDocument, ...args: any[]): Promise<T>;
    updateOne<T>(docs: IDatabaseDocument[], ...args: any[]): Promise<T>;
    
    deleteOne<T>(doc: IDatabaseDocument): Promise<T>;
    deleteMany<T>(docs: IDatabaseDocument[]): Promise<T>;

    truncate(): Promise<void>;

    belongsToCtor(): IBelongsToCtor;
    hasManyCtor(): IHasManyCtor;
}

export interface IDatabaseDocument {
    id?: any;
    [key: string]: any;
}