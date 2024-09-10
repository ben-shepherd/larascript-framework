// Import necessary interfaces and classes
import MissingTable from "@src/core/domains/database/exceptions/InvalidTable";
import { IDatabaseProvider } from "@src/core/domains/database/interfaces/IDatabaseProvider";
import { IDatabaseDocument, IDocumentManager } from "@src/core/domains/database/interfaces/IDocumentManager";
import { IDocumentValidator } from "@src/core/domains/database/interfaces/IDocumentValidator";
import { IPrepareOptions } from "@src/core/domains/database/interfaces/IPrepareOptions";
import { IBelongsToOptions } from "@src/core/domains/database/interfaces/relationships/IBelongsTo";
import { IHasManyOptions } from "@src/core/domains/database/interfaces/relationships/IHasMany";
import BelongsTo from "@src/core/domains/database/relationships/BelongsTo";
import HasMany from "@src/core/domains/database/relationships/HasMany";
import DocumentValidator from "@src/core/domains/database/validator/DocumentValidator";

/**
 * Abstract base class for document management operations
 * @template Query - Type extending IDocumentManager
 * @template Provider - Type extending IDatabaseProvider
 */
abstract class BaseDocumentManager<
    Query extends IDocumentManager = IDocumentManager,
    Provider extends IDatabaseProvider = IDatabaseProvider
> implements IDocumentManager {

    // Protected properties
    protected driver!: Provider;

    protected tableName!: string;
    
    // Public property for document validation
    public readonly validator: IDocumentValidator = new DocumentValidator();
    
    /**
     * Constructor for BaseDocumentManager
     * @param driver - Database provider instance
     */
    constructor(driver: Provider) {
        this.driver = driver;
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
    table(table: string): Query {
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
     * Handle "belongs to" relationship
     * @param document - Source document
     * @param options - Relationship options
     * @returns Promise resolving to related document or null
     */
    async belongsTo<T>(document: IDatabaseDocument, options: IBelongsToOptions): Promise<T | null> {
        return new BelongsTo().handle(this.driver.connectionName, document, options);
    }

    /**
     * Handle "has many" relationship
     * @param document - Source document
     * @param options - Relationship options
     * @returns Promise resolving to array of related documents
     */
    async hasMany<T>(document: IDatabaseDocument, options: IHasManyOptions): Promise<T> {
        return new HasMany().handle(this.driver.connectionName, document, options) as T;
    }

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
                console.log(`Database error(${this.driver.connectionName}): `, err.message, err.stack)
            }
            throw err
        }
    }

}

export default BaseDocumentManager