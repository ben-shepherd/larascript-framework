/* eslint-disable no-unused-vars */
import MissingTable from "@src/core/domains/database/exceptions/InvalidTable";
import { IDatabaseAdapter } from "@src/core/domains/database/interfaces/IDatabaseAdapter";
import { IDatabaseDocument, IDocumentManager } from "@src/core/domains/database/interfaces/IDocumentManager";
import { IDocumentValidator } from "@src/core/domains/database/interfaces/IDocumentValidator";
import { IPrepareOptions } from "@src/core/domains/database/interfaces/IPrepareOptions";
import DocumentValidator from "@src/core/domains/database/validator/DocumentValidator";
import { App } from "@src/core/services/App";

/**
 * Abstract base class for document management operations
 * @template TDocMan - Type extending IDocumentManager
 * @template TAdapter - Type extending IDatabaseProvider
 */
abstract class BaseDocumentManager<TDocMan extends IDocumentManager = IDocumentManager, TAdapter extends IDatabaseAdapter = IDatabaseAdapter> implements IDocumentManager {

    // Protected properties
    protected adapter!: TAdapter;

    protected tableName!: string;
    
    // Public property for document validation
    public readonly validator: IDocumentValidator = new DocumentValidator();
    
    /**
     * Constructor for BaseDocumentManager
     * @param adapter - Database provider instance
     */
    constructor(adapter: TAdapter) {
        this.adapter = adapter;
    }

    /**
     * Prepare document for database operations
     * @param document - Document to be prepared
     * @param options - Optional preparation options
     * @returns Prepared document
     */
    prepareDocument(document: IDatabaseDocument, options?: IPrepareOptions): IDatabaseDocument {
        const preparedDocument = {...document}

        for(const key in preparedDocument) {
            if(options?.jsonStringify?.includes(key)) {
                preparedDocument[key] = JSON.stringify(preparedDocument[key])
            }
            if(options?.jsonParse?.includes(key)) {
                preparedDocument[key] = JSON.parse(preparedDocument[key])
            }
        }
        
        return preparedDocument
    }

    /**
     * Set the table name for database operations
     * @param table - Name of the table
     * @returns Current instance cast as Query type
     */
    table(table: string): TDocMan {
        this.tableName = table;
        return this as any;
    } 

    /**
     * Get the current table name
     * @returns Current table name
     * @throws MissingTable if table name is not set
     */
    getTable(): string {
        if(!this.tableName) {
            throw new MissingTable()
        }

        return this.tableName;
    }

    // Abstract methods to be implemented by subclasses
    abstract findById<T>(id: string): Promise<T | null>;

    abstract findOne<T>(options: object): Promise<T | null>;

    abstract findMany<T>(options: object): Promise<T>;

    abstract insertOne<T>(document: IDatabaseDocument): Promise<T>;

    abstract insertMany<T>(documents: IDatabaseDocument[]): Promise<T>;

    abstract updateOne<T>(document: IDatabaseDocument): Promise<T>;

    abstract updateMany<T>(documents: IDatabaseDocument[]): Promise<T>;

    abstract deleteOne<T>(filter: object): Promise<T>;

    abstract deleteMany<T>(filter: object): Promise<T>;

    abstract truncate(): Promise<void>;

    /**
     * Catches and logs any errors that occur in the callback,
     * then re-throws the error
     * @param callback - The callback function to wrap
     * @returns The result of the callback, or throws an error if it fails
     */
    protected async captureError<T>(callback:  () => Promise<T>): Promise<T> {
        try {
            return await callback()
        }
        catch (err) {
            if(err instanceof Error && err?.message) {
                App.container('logger').error(`Database error(${this.adapter.getConnectionName()}): `, err.message, err.stack)
            }
            throw err
        }
    }

}

export default BaseDocumentManager