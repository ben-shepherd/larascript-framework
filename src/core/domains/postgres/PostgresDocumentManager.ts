import BaseDocumentManager from "@src/core/domains/database/base/BaseDocumentManager";
import { IDatabaseDocument } from "@src/core/domains/database/interfaces/IDocumentManager";
import PostgresAdapter from "@src/core/domains/postgres/adapters/PostgresAdapter";
import { generateUuidV4 } from "@src/core/util/uuid/generateUuidV4";
import { BindOrReplacements, QueryOptions, QueryTypes } from "sequelize";
import LegacyPostgresQueryBuilder, { TLegacySelectOptions } from "@src/core/domains/postgres/builder/LegacyPostgresQueryBuilder";



/**
 * PostgreSQL document manager
 *
 * Provides methods for interacting with a PostgreSQL database
 * 
 * @deprecated
 */
class PostgresDocumentManager extends BaseDocumentManager<PostgresDocumentManager, PostgresAdapter> {

    protected builder = new LegacyPostgresQueryBuilder()

    /**
     * Adds the id: uuid to the document
     * @param document The document to add an id to
     * @returns The document with an id added
     */
    protected documentWithUuid(document: IDatabaseDocument): IDatabaseDocument {
        return {
            ...document,
            id: generateUuidV4()
        }
    }

    /**
     * Removes undefined properties from the document
     * @param document The document to clean
     * @returns The cleaned document
     */
    protected documentStripUndefinedProperties(document: IDatabaseDocument): IDatabaseDocument {
        for (const key in document) {
            if (document[key] === undefined) {
                delete document[key]
            }
        }
        return document
    }

    /**
     * Find a document by id
     * @param id The id of the document to find
     * @returns The found document, or null if not found
     */
    async findById<T>(id: string): Promise<T | null> {
        return this.captureError(async () => {
            try {
                return await this.findOne({
                    filter: {
                        id: id
                    }
                }) as T ?? null
            }
            catch (err) {
                if(err instanceof Error && !(err?.message.includes('invalid input syntax for type uuid'))) { 
                    throw err
                }
            }  
            return null
        })
    }

    /**
     * Find a single document
     * @param selectOptions The options for selecting the document
     * @returns The found document, or null if not found
     */
    async findOne<T>(selectOptions: Partial<TLegacySelectOptions>): Promise<T | null> {
        return this.captureError(async () => {
            const sequelize = this.adapter.getSequelize();
            const queryString = this.builder.select({
                ...selectOptions,
                tableName: this.getTable(),
                limit: 1
            })

            const results = await sequelize.query(
                queryString,
                {
                    replacements: (selectOptions.filter ?? {}) as BindOrReplacements,
                    type: QueryTypes.SELECT,
                }
            );

            return results.length > 0 ? results[0] as T : null
        })
    }

    /**
     * Find multiple documents
     * @param options The options for selecting the documents
     * @returns The found documents
     */
    async findMany<T>(options: Partial<TLegacySelectOptions>): Promise<T> {
        return this.captureError(async () => {
            const sequelize = this.adapter.getSequelize()

            const queryString = this.builder.select({
                ...options,
                tableName: this.getTable()
            })

            return await sequelize.query(
                queryString,
                {
                    replacements: (options.filter ?? {}) as BindOrReplacements,
                    type: QueryTypes.SELECT,
                },
            ) as T
        })
    }

    /**
     * Insert a single document
     * @param document The document to insert
     * @param options The options for inserting the document
     * @returns The inserted document
     */
    async insertOne<T = object>(document: IDatabaseDocument, options?: QueryOptions): Promise<T> {
        return this.captureError(async () => {
            this.validator.validateSingleDocument(document)
            this.validator.validateWithoutId(document)

            document = this.documentWithUuid(document)
            document = this.documentStripUndefinedProperties(document)

            const queryInterface = this.adapter.getSequelizeQueryInterface();
            await queryInterface.insert(null, this.getTable(), document, options) as T

            return document as T
        })
    }

    /**
     * Insert multiple documents
     * @param documents The documents to insert
     * @param options The options for inserting the documents
     * @returns The inserted documents
     */
    async insertMany<T>(documents: IDatabaseDocument[], options?: QueryOptions): Promise<T> {
        return this.captureError(async () => {
            this.validator.validateMultipleDocuments(documents)
            this.validator.validateWithoutId(documents)

            documents = documents.map(d => this.documentWithUuid(d))
            documents = documents.map(d => this.documentStripUndefinedProperties(d))

            const queryInterface = this.adapter.getSequelizeQueryInterface();
            await queryInterface.bulkInsert(this.getTable(), documents, options) as T[];

            return documents as T
        })
    }

    /**
     * Update a single document
     * @param document The document to update
     * @returns The updated document
     */
    async updateOne<T>(document: IDatabaseDocument): Promise<T> {
        return this.captureError(async () => {
            this.validator.validateSingleDocument(document)
            this.validator.validateContainsId(document)

            const queryInterface = this.adapter.getSequelizeQueryInterface();
            await queryInterface.bulkUpdate(this.getTable(), document, { id: document.id })

            return document as T
        })
    }

    /**
     * Update multiple documents
     * @param documents The documents to update
     * @returns The updated documents
     */
    async updateMany<T>(documents: IDatabaseDocument[]): Promise<T> {
        return this.captureError(async () => {
            this.validator.validateMultipleDocuments(documents)
            this.validator.validateContainsId(documents)

            for (const document of documents) {
                await this.updateOne(document)
            }

            return documents as T
        })
    }

    /**
     * Delete a single document
     * @param document The document to delete
     * @returns The deleted document
     */
    async deleteOne<T>(document: IDatabaseDocument): Promise<T> {
        return this.captureError(async () => {
            this.validator.validateSingleDocument(document)
            this.validator.validateContainsId(document)

            const queryInterface = this.adapter.getSequelizeQueryInterface();

            return await queryInterface.bulkDelete(this.getTable(), {
                id: document.id
            }) as T
        })
    }

    /**
     * Delete multiple documents
     * @param documents The documents to delete
     * @returns The deleted documents
     */
    async deleteMany<T>(documents: IDatabaseDocument): Promise<T> {
        return this.captureError(async () => {
            this.validator.validateMultipleDocuments(documents)
            this.validator.validateContainsId(documents)

            return documents.forEach(async (document) => {
                return await this.deleteOne(document)
            })
        })
    }

    /**
     * Truncate the table
     */
    async truncate(): Promise<void> {
        return this.captureError(async () => {
            const queryInterface = this.adapter.getSequelizeQueryInterface();
            await queryInterface.bulkDelete(this.getTable(), {});
        })
    }

}

export default PostgresDocumentManager
