import { IDatabaseProvider } from "@src/core/domains/database/interfaces/IDatabaseProvider";
import { IDatabaseDocument, IDatabaseQuery } from "@src/core/domains/database/interfaces/IDatabaseQuery";
import { IBelongsToCtor } from "@src/core/domains/database/interfaces/relationships/IBelongsTo";
import { IHasManyCtor } from "@src/core/domains/database/interfaces/relationships/IHasMany";
import BelongsTo from "@src/core/domains/database/relationships/BelongsTo";
import HasMany from "@src/core/domains/database/relationships/HasMany";

abstract class DatabaseQuery<Query extends IDatabaseQuery = IDatabaseQuery,  Provider extends IDatabaseProvider = IDatabaseProvider> implements IDatabaseQuery
{
    protected driver!: Provider;
    protected tableName!: string;

    constructor(driver: Provider)
    {
        this.driver = driver;
    }

    table(table: string): Query
    {
        this.tableName = table;
        return this as any;
    } 

    findById<T>(id: string): Promise<T | null> {
        throw new Error("Method not implemented.");
    }

    findOne<T>(filter?: object): Promise<T | null> {
        throw new Error("Method not implemented.");
    }

    findMany<T>(filter?: object): Promise<T[]> {
        throw new Error("Method not implemented.");
    }

    insertOne<T>(document: IDatabaseDocument): Promise<T> {
        throw new Error("Method not implemented.");
    }

    insertMany<T>(documents: IDatabaseDocument[]): Promise<T[]> {
        throw new Error("Method not implemented.");
    }

    updateOne<T>(document: IDatabaseDocument): Promise<T> {
        throw new Error("Method not implemented.");
    }

    updateMany<T>(documents: IDatabaseDocument[]): Promise<T> {
        throw new Error("Method not implemented.");
    }

    deleteOne<T>(filter: object): Promise<T> {
        throw new Error("Method not implemented.");
    }

    deleteMany<T>(filter: object): Promise<T> {
        throw new Error("Method not implemented.");
    }

    truncate(): Promise<void> {
        throw new Error("Method not implemented.");
    }

    belongsToCtor(): IBelongsToCtor
    {
        return BelongsTo
    }

    hasManyCtor(): IHasManyCtor
    {
        return HasMany;
    }
}

export default DatabaseQuery