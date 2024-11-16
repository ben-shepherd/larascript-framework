import BaseDocumentManagerLegacy from "@src/core/domains/database/base/BaseDocumentManagerLegacy";
import MongoDbQueryBuilder from "@src/core/domains/database/builder/MongoDbQueryBuilder";
import MongoDbIdentiferConcern from "@src/core/domains/database/concerns/MongoDbIdentiferConcern";
import InvalidObjectId from "@src/core/domains/database/exceptions/InvalidObjectId";
import { FindOptions, IDatabaseDocument, OrderOptions } from "@src/core/domains/database/interfaces/IDocumentManager";
import { IPrepareOptions } from "@src/core/domains/database/interfaces/IPrepareOptions";
import { IBelongsToOptions } from "@src/core/domains/database/interfaces/relationships/IBelongsTo";
import MongoDB from "@src/core/domains/database/providers-db/MongoDB";
import MongoDBBelongsTo from "@src/core/domains/database/relationships/mongodb/MongoDBBelongsTo";
import { BulkWriteOptions, Sort, UpdateOptions } from "mongodb";

class MongoDbDocumentManager extends BaseDocumentManagerLegacy<MongoDbDocumentManager, MongoDB> {

    protected driver!: MongoDB;

    protected builder = new MongoDbQueryBuilder()

    protected identifierConcern = new MongoDbIdentiferConcern()

    constructor(driver: MongoDB) {
        super(driver);
        this.driver = driver;
    }

    /**
     * Prepare a document for insertion or update.
     * 
     * @param document The document to prepare.
     * @param options Optional preparation options.
     * @returns The prepared document.
     */
    // eslint-disable-next-line no-unused-vars
    prepareDocument(document: IDatabaseDocument, options?: IPrepareOptions): IDatabaseDocument {
        // We don't need to prepare the document into a stringified JSON for MongoDB documents
        return document
    }

    /**
     * Removes `id` and `_id` from document
     * @param document 
     * @param fields 
     * @returns 
     */
    protected stripIds(document: IDatabaseDocument, fields: string[] = ['id', '_id']): IDatabaseDocument {
        const data = { ...document }

        fields.forEach((field: string) => {
            if (field in data) {
                delete data[field]
            }
        })
        
        return data
    }

    protected convertOrderToSort(order: OrderOptions): Sort {
        const sort = {}
        Object.keys(order).forEach((key: string) => {
            Object.keys(order[key]).forEach((column: string) => {
                sort[column] = order[key][column].toLowerCase() === 'asc' ? 1 : -1
            })
        })
        return sort
    }

    /**
     * Find document by _id
     * 
     * @param id 
     * @returns 
     */
    async findById<T = IDatabaseDocument>(id: string): Promise<T | null> {
        return this.captureError(async() => {
            try {
                return this.findOne({ filter: { _id: this.identifierConcern.convertToObjectId(id) } })
            }
            catch (err) {
                if (!(err instanceof InvalidObjectId)) {
                    throw err
                }
            }
            return null
        })
    }

    /**
     * Find a single document
     * 
     * @param filter 
     * @returns 
     */
    async findOne<T>({ filter = {}, allowPartialSearch = false, useFuzzySearch = false }: Pick<FindOptions, 'filter' | 'allowPartialSearch' | 'useFuzzySearch'>): Promise<T | null> {
        return this.captureError(async() => {

            filter = this.builder.select({ filter, allowPartialSearch, useFuzzySearch })

            let document = await this.driver.getDb().collection(this.getTable()).findOne(filter) as T | null;
    
            if (document) {
                document = this.identifierConcern.convertObjectIdToStringInDocument(document) as T;
            }
    
            return document
        })
    }

    /**
     * Find multiple documents
     * 
     * @param options The options for selecting the documents
     * @returns The found documents
     */
    
    async findMany<T>({ filter, order, limit, skip, allowPartialSearch = false, useFuzzySearch = false }: FindOptions): Promise<T> {
        return this.captureError(async() => {

            filter = this.builder.select({ filter, allowPartialSearch, useFuzzySearch })

            const documents = await this.driver
                .getDb()
                .collection(this.getTable())
                .find(filter as object, {
                    sort: order ? this.convertOrderToSort(order ?? []) : undefined,
                    limit,
                    skip
                })
                .toArray();
    
            return documents.map((d: any) => this.identifierConcern.convertObjectIdToStringInDocument(d)) as T
        })
    }

    /**
     * Insert a single document
     * 
     * @param document 
     * @returns 
     */
    async insertOne<T>(document: IDatabaseDocument): Promise<T> {
        return this.captureError(async() => {
            this.validator.validateSingleDocument(document)
            this.validator.validateWithoutId(document)
    
            /**
             * Insert the document
             */
            await this.driver.getDb().collection(this.getTable()).insertOne(document);
    
            /**
             * After the document is inserted, MongoDB will automatically add `_id: ObjectId` to the document object.
             * We will need to convert this to our standard `id: string` format
             */
            return this.identifierConcern.convertObjectIdToStringInDocument(document) as T
        })
    }

    /**
     * Insert multiple documents
     * 
     * @param documentsArray 
     * @param options 
     * @returns 
     */
    async insertMany<T>(documentsArray: IDatabaseDocument[], options?: BulkWriteOptions): Promise<T> {
        return this.captureError(async() => {
            this.validator.validateMultipleDocuments(documentsArray)
            this.validator.validateWithoutId(documentsArray)
    
            /**
             * Insert the documents
             */
            await this.driver.getDb().collection(this.getTable()).insertMany(documentsArray, options);
    
            /**
             * After the document is inserted, MongoDB will automatically add `_id: ObjectId` to the document object.
             * We will need to convert this to our standard `id: string` format
             */
            return documentsArray.map((d: IDatabaseDocument) => this.identifierConcern.convertObjectIdToStringInDocument(d)) as T
        })
    }

    /**
     * Update a single document
     * 
     * @param document 
     * @param options 
     * @returns 
     */
    async updateOne<T>(document: IDatabaseDocument, options?: UpdateOptions): Promise<T> {
        return this.captureError(async() => {
            this.validator.validateSingleDocument(document)
            this.validator.validateContainsId(document)
            
            const objectId =  this.identifierConcern.convertToObjectId(document.id)
            const data = this.stripIds(document)
    
            await this.driver.getDb().collection(this.getTable()).updateOne({ _id: objectId }, { $set: data }, options) as T
            
            return this.identifierConcern.convertObjectIdToStringInDocument(document) as T;
        })
    }

    /**
     * Update multiple documents
     * 
     * @param documentsArray 
     * @param options 
     * @returns 
     */
    async updateMany<T>(documentsArray: IDatabaseDocument[], options?: UpdateOptions): Promise<T> {
        return this.captureError(async() => {
            this.validator.validateMultipleDocuments(documentsArray)
            this.validator.validateContainsId(documentsArray)
    
            const documentsUpdated: IDatabaseDocument[] = [];
    
            for (const document of documentsArray) {
                documentsUpdated.push(await this.updateOne(document, options))
            }
    
            return documentsUpdated as T
        })
    }

    /**
     * Delete a single document
     * 
     * @param document 
     * @returns 
     */
    async deleteOne<T>(document: IDatabaseDocument): Promise<T> {
        return this.captureError(async() => {
            this.validator.validateSingleDocument(document)
            this.validator.validateContainsId(document)
    
            return await this.driver.getDb().collection(this.getTable()).deleteOne({ 
                _id: this.identifierConcern.convertToObjectId(document.id)
            }) as T
        })
    }

    /**
     * Delete multiple documents
     * 
     * @param documentsArray 
     * @returns 
     */
    async deleteMany<T>(documentsArray: IDatabaseDocument[]): Promise<T> {
        return this.captureError(async() => {
            this.validator.validateMultipleDocuments(documentsArray)
            this.validator.validateContainsId(documentsArray)
    
            for(const document of documentsArray) {
                await this.deleteOne(document)
            }

            return documentsArray as T
        })
    }

    /**
     * Truncate the collection
     */
    async truncate(): Promise<void> {
        return this.captureError(async() => {
            await this.driver.getDb().collection(this.getTable()).deleteMany({})
        })
    }


    async belongsTo<T>(document: IDatabaseDocument, options: IBelongsToOptions): Promise<T | null> {
        return this.captureError(async() => {
            return new MongoDBBelongsTo().handle(
                this.driver.connectionName,
                document,
                options
            ) as T ?? null
        })
    }

    
}

export default MongoDbDocumentManager