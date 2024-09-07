import PostgresQueryBuilder, { SelectOptions } from "@src/core/domains/database/builder/PostgresQueryBuilder";
import { IDatabaseDocument } from "@src/core/domains/database/interfaces/IDocumentManager";
import Postgres from "@src/core/domains/database/providers-db/Postgres";
import { generateUuidV4 } from "@src/core/util/uuid/generateUuidV4";
import { BindOrReplacements, QueryOptions, QueryTypes } from "sequelize";
import BaseDocumentManager from "@src/core/domains/database/base/BaseDocumentManager";

class PostgresDocumentManager extends BaseDocumentManager<PostgresDocumentManager, Postgres> {

    protected builder = new PostgresQueryBuilder()

    /**
     * Adds the id: uuid to the document
     * @param document 
     * @returns 
     */
    protected documentWithUuid(document: IDatabaseDocument): IDatabaseDocument {
        return {
            ...document,
            id: generateUuidV4()
        }
    }

    protected documentStripUndefinedProperties(document: IDatabaseDocument): IDatabaseDocument {
        for(const key in document) {
            if(document[key] === undefined) {
                delete document[key]
            }
        }
        return document
    }

    /**
     * Find document by id
     * @param id 
     * @returns 
     */
    async findById<T>(id: string): Promise<T | null> {
        return this.findOne({
            filter: {
                id: id
            }
        }) as T ?? null
    }

    /**
     * Find a single document
     * @param filter 
     * @returns 
     */
    async findOne<T>(selectOptions: Partial<SelectOptions>): Promise<T | null> {
        try {
            const sequelize = this.driver.getClient();
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
        }
        catch (err) {
            console.log(err)
        }

        return null
    }

    async findMany<T>(selectOptions: Partial<SelectOptions>): Promise<T> {
        const sequelize = this.driver.getClient()
        const queryString = this.builder.select({
            ...selectOptions,
            tableName: this.getTable()
        })

        return await sequelize.query(
            queryString,
            {
                replacements: (selectOptions.filter ?? {}) as BindOrReplacements,
                type: QueryTypes.SELECT,
            }
        ) as T
    }

    /**
     * Insert one document
     * @param document 
     * @param options 
     * @returns 
     */
    async insertOne<T = object>(document: IDatabaseDocument, options?: QueryOptions): Promise<T> {
        this.validator.validateSingleDocument(document)
        this.validator.validateWithoutId(document)

        document = this.documentWithUuid(document)
        document = this.documentStripUndefinedProperties(document)

        const queryInterface = this.driver.getQueryInterface();
        await queryInterface.insert(null, this.getTable(), document, options) as T

        return document as T
    }

    /**
     * Insert multiple documents
     * @param documents 
     * @param options 
     * @returns 
     */
    async insertMany<T>(documents: IDatabaseDocument[], options?: QueryOptions): Promise<T> {
        this.validator.validateMultipleDocuments(documents)
        this.validator.validateWithoutId(documents)

        documents = documents.map(d => this.documentWithUuid(d))
        documents = documents.map(d => this.documentStripUndefinedProperties(d))

        const queryInterface = this.driver.getQueryInterface();
        await queryInterface.bulkInsert(this.getTable(), documents, options) as T[];

        return documents as T
    }

    /**
     * Update one document
     * @param document 
     * @returns 
     */
    async updateOne<T>(document: IDatabaseDocument): Promise<T> {
        this.validator.validateSingleDocument(document)
        this.validator.validateContainsId(document)

        const queryInterface = this.driver.getQueryInterface();
        await queryInterface.bulkUpdate(this.getTable(), document, { id: document.id })

        return document as T
    }

    /**
     * Update multiple documents
     * @param documents 
     * @returns 
     */
    async updateMany<T>(documents: IDatabaseDocument[]): Promise<T> {
        this.validator.validateMultipleDocuments(documents)
        this.validator.validateContainsId(documents)

        for (const document of documents) {
            await this.updateOne(document)
        }

        return documents as T
    }

    /**
     * Delete one document
     * @param document 
     * @returns 
     */
    async deleteOne<T>(document: IDatabaseDocument): Promise<T> {
        this.validator.validateSingleDocument(document)
        this.validator.validateContainsId(document)

        const queryInterface = this.driver.getQueryInterface();

        return await queryInterface.bulkDelete(this.getTable(), {
            id: document.id
        }) as T
    }

    /**
     * Delete multiple documents
     * @param documents 
     * @returns 
     */
    async deleteMany<T>(documents: IDatabaseDocument): Promise<T> {
        this.validator.validateMultipleDocuments(documents)
        this.validator.validateContainsId(documents)

        return documents.forEach(async (document) => {
            return await this.deleteOne(document)
        })
    }

    /**
     * Truncate table
     */
    async truncate(): Promise<void> {
        const queryInterface = this.driver.getQueryInterface();
        await queryInterface.bulkDelete(this.getTable(), {});
    }

}

export default PostgresDocumentManager