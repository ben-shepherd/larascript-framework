/* eslint-disable no-unused-vars */
import { IDocumentValidator } from "@src/core/domains/database/interfaces/IDocumentValidator";
import { IPrepareOptions } from "@src/core/domains/database/interfaces/IPrepareOptions";
import { IBelongsToOptions } from "@src/core/domains/database/interfaces/relationships/IBelongsTo";
import { IHasManyOptions } from "@src/core/domains/database/interfaces/relationships/IHasMany";

export interface IDatabaseDocument {
    id?: any;
    [key: string]: any;
}

export type OrderOptions = Record<string, 'ASC' | 'DESC'>[];
export type FindOptions = { filter?: object, order?: OrderOptions, limit?: number, skip?: number, allowPartialSearch?: boolean, useFuzzySearch?: boolean };

/**
 * Provides methods for interacting with a database table.
 *
 * @template T The type of the documents managed by this IDocumentManager.
 */
export interface IDocumentManager<T = any> {

    /**
     * The document validator used by this IDocumentManager.
     */
    validator: IDocumentValidator;

    /**
     * Prepare a document for insertion or update.
     *
     * @param document The document to prepare.
     * @param options Optional preparation options.
     * @returns The prepared document.
     */
    prepareDocument(document: IDatabaseDocument, options?: IPrepareOptions): IDatabaseDocument;
    
    /**
     * Set the table name for database operations.
     *
     * @param table The name of the table.
     * @returns The current instance, cast as the type of the IDocumentManager.
     */
    table(table: string): IDocumentManager<T>;
    
    /**
     * Find a document by id.
     *
     * @param id The id of the document to find.
     * @returns A promise resolving to the found document, or null if not found.
     */
    findById(id: string): Promise<T | null>;
    
    /**
     * Find a single document.
     *
     * @param options The options for selecting the document.
     * @returns A promise resolving to the found document, or null if not found.
     */
    findOne(options: FindOptions): Promise<T | null>;
    
    /**
     * Find multiple documents.
     *
     * @param options The options for selecting the documents.
     * @returns A promise resolving to the found documents.
     */
    findMany(options: FindOptions): Promise<T>;
    
    /**
     * Insert a single document.
     *
     * @param document The document to insert.
     * @param options Optional insertion options.
     * @returns A promise resolving to the inserted document.
     */
    insertOne(document: IDatabaseDocument, options?: object): Promise<T>;
    
    /**
     * Insert multiple documents.
     *
     * @param documents The documents to insert.
     * @param options Optional insertion options.
     * @returns A promise resolving to the inserted documents.
     */
    insertMany(documents: IDatabaseDocument[], options?: object): Promise<T>;
    
    /**
     * Update a single document.
     *
     * @param document The document to update.
     * @param options Optional update options.
     * @returns A promise resolving to the updated document.
     */
    updateOne(document: IDatabaseDocument, options?: object): Promise<T>;
    
    /**
     * Update multiple documents.
     *
     * @param documents The documents to update.
     * @param options Optional update options.
     * @returns A promise resolving to the updated documents.
     */
    updateMany(documents: IDatabaseDocument[], options?: object): Promise<T>;
    
    /**
     * Delete a single document.
     *
     * @param document The document to delete.
     * @returns A promise resolving to the deleted document.
     */
    deleteOne(document: IDatabaseDocument): Promise<T>;
    
    /**
     * Delete multiple documents.
     *
     * @param documents The documents to delete.
     * @returns A promise resolving to the deleted documents.
     */
    deleteMany(documents: IDatabaseDocument[]): Promise<T>;

    /**
     * Truncate the table.
     *
     * @returns A promise resolving when the truncate is complete.
     */
    truncate(): Promise<void>;

    /**
     * Handle a "belongs to" relationship.
     *
     * @param document The source document.
     * @param options The relationship options.
     * @returns A promise resolving to the related document, or null if not found.
     */
    belongsTo(document: IDatabaseDocument, options: IBelongsToOptions): Promise<T | null>;
    
    /**
     * Handle a "has many" relationship.
     *
     * @param document The source document.
     * @param options The relationship options.
     * @returns A promise resolving to the related documents.
     */
    hasMany(document: IDatabaseDocument, options: IHasManyOptions): Promise<T[]>;
}
