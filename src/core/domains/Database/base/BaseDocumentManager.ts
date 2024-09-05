import { IDatabaseProvider } from "@src/core/domains/database/interfaces/IDatabaseProvider";
import { IDatabaseDocument, IDocumentManager } from "@src/core/domains/database/interfaces/IDocumentManager";
import { IBelongsToCtor } from "@src/core/domains/database/interfaces/relationships/IBelongsTo";
import { IHasManyCtor } from "@src/core/domains/database/interfaces/relationships/IHasMany";
import BelongsTo from "@src/core/domains/database/relationships/BelongsTo";
import HasMany from "@src/core/domains/database/relationships/HasMany";
import { IDocumentValidator } from "../interfaces/IDocumentValidator";
import DocumentValidator from "../validator/DocumentValidator";

abstract class BaseDocumentManager<Query extends IDocumentManager = IDocumentManager,  Provider extends IDatabaseProvider = IDatabaseProvider> implements IDocumentManager
{
    protected driver!: Provider;
    protected tableName!: string;
    
    public readonly validator: IDocumentValidator = new DocumentValidator();

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

    findOne<T>({filter = {}}: {filter?: object}): Promise<T | null> {
        throw new Error("Method not implemented.");
    }

    findMany<T>({filter = {}}: {filter?: object}): Promise<T[]> {
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

export default BaseDocumentManager