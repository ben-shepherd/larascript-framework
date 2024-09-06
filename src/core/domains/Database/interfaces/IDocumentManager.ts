import { IBelongsToOptions } from "@src/core/domains/database/interfaces/relationships/IBelongsTo";
import { IHasManyOptions } from "@src/core/domains/database/interfaces/relationships/IHasMany";
import { IDocumentValidator } from "./IDocumentValidator";

export interface IDocumentManager {
    validator: IDocumentValidator;
    
    table(table: string): IDocumentManager;
    
    findById<T>(id: string): Promise<T | null>;
    findOne<T>(...args: any[]): Promise<T | null>;
    findMany<T>(...args: any[]): Promise<T>;
    
    insertOne<T>(document: IDatabaseDocument, ...args: any[]): Promise<T>;
    insertMany<T>(documents: IDatabaseDocument[], ...args: any[]): Promise<T>;
    
    updateOne<T>(document: IDatabaseDocument, ...args: any[]): Promise<T>;
    updateMany<T>(documents: IDatabaseDocument[], ...args: any[]): Promise<T>;
    
    deleteOne<T>(document: IDatabaseDocument): Promise<T>;
    deleteMany<T>(documents: IDatabaseDocument[]): Promise<T>;

    truncate(): Promise<void>;

    belongsTo<T>(document: IDatabaseDocument, options: IBelongsToOptions): Promise<T | null>;
    hasMany<T>(document: IDatabaseDocument, options: IHasManyOptions): Promise<T>;
}

export interface IDatabaseDocument {
    id?: any;
    [key: string]: any;
}