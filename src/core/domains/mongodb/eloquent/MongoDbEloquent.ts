import ModelNotFound from "@src/core/exceptions/ModelNotFound";
import { IModel } from "@src/core/interfaces/IModel";
import captureError from "@src/core/util/captureError";
import { Document, Collection as MongoCollection, ObjectId } from "mongodb";

import Collection from "../../collections/Collection";
import collect from "../../collections/helper/collect";
import Eloquent from "../../eloquent/Eloquent";
import EloquentException from "../../eloquent/exceptions/EloquentExpression";
import MongoDbAdapter from "../adapters/MongoDbAdapter";
import PipelineBuilder from "../builder/PipelineBuilder";

class MongoDbEloquent<Model extends IModel> extends Eloquent<Model, PipelineBuilder, MongoDbAdapter> {

    /**
     * The query builder expression object
     */
    protected expression: PipelineBuilder = new PipelineBuilder()

    /**
     * Retrieves the MongoDB Collection instance for the model.
     * @param collectionName Optional collection name to use. If not provided, the model's table name will be used.
     * @returns The MongoDB Collection instance.
     * @throws Error if the model constructor is not set.
     */
    protected getDbCollection(collectionName?: string): MongoCollection {
        const modelCtor = this.getModelCtor()
        if(!modelCtor) {
            throw new Error('Model constructor is not set');
        }
        if(!collectionName) {
            collectionName = modelCtor.getTable()
        }
        return this.getDatabaseAdapter().getDb().collection(collectionName)
    }

    /**
     * Normalizes document id to ObjectId
     * @param id The id to normalize
     * @returns The normalized ObjectId
     * @throws EloquentException if the id is invalid
     */
    denormalizeId(id: unknown): ObjectId | string | number {
        if(id instanceof ObjectId) {
            return id
        }
        if(typeof id === 'string') {    
            return ObjectId.createFromHexString(id)
        }
        if(typeof id === 'number') {
            return ObjectId.createFromHexString(id.toString())
        }
        
        throw new EloquentException('Invalid document id')
    }

    /**
     * Denormalizes an id to an ObjectId
     * @param id The id to denormalize
     * @returns The denormalized ObjectId
     * @throws EloquentException if the id is invalid
     */
    normalizeId(id: string | number | ObjectId): string {
        if(id instanceof ObjectId) {
            return id.toString()
        }
        if(typeof id === 'string') {
            return id
        }
        if(typeof id === 'number') {
            return id.toString()
        }
        
        throw new EloquentException('Invalid document id')
    }

    /**
     * Normalizes document IDs by converting MongoDB _id fields to standard id fields.
     * If the `id` field is an instance of `ObjectId`, it is converted to a string.
     * The original `_id` field is removed from the documents.
     *
     * @param documents - A single document or an array of documents to normalize
     * @returns An array of documents with normalized id fields
     */
    protected normalizeDocuments(documents: Document | Document[]): Document[] {
        const documentsArray = Array.isArray(documents) ? documents : [documents]

        return documentsArray.map(document => {
            if(document._id) {
                document.id = this.normalizeId(document._id)
                delete document._id
            }
            return document
        })
    }

    /*
    * Denormalizes document IDs by converting standard id fields back to MongoDB's _id format.
    * If the `id` field is a string, it is converted to ObjectId.
    * The original `id` field is removed from the document.
    *
    * @param document - The document to denormalize
    * @returns Document with MongoDB compatible _id field
    */
    protected denormalizeDocuments(document: Document | Document[]): Document | Document[] {
        const documentsArray = Array.isArray(document) ? document : [document]

        return documentsArray.map(document => {
            if(document.id) {
                if(this.idGeneratorFn) {
                    document._id = document.id
                }
                else {
                    document._id = this.denormalizeId(document.id)
                }
                delete document.id
            }

            return document
        })
    }

    /**
     * Executes a raw MongoDB aggregation query and returns the results.
     * @param aggregation - The aggregation pipeline to execute
     * @returns The results of the aggregation query
     */
    async raw<T = NonNullable<Model['attributes']>[]>(aggregation: object[]): Promise<T> {
        return captureError<T>(async () => {
            console.log('[MongoDbEloquent] raw', JSON.stringify(aggregation, null, 2)   )
            const collection = this.getDbCollection();

            const results = this.normalizeDocuments(
                await collection.aggregate(aggregation).toArray()
            ) as T

            console.log('[MongoDbEloquent] raw results', JSON.stringify(results, null, 2))
            return results;
        })
    }

    /**
     * Fetches rows from the database using the current query builder expression.
     * @param expression - The query builder expression to use. Defaults to the current expression.
     * @returns The fetched rows
     */
    async fetchRows<T = unknown>(expression: PipelineBuilder = this.expression): Promise<T> {
        return await captureError<T>(async () => {

            const previousExpression = this.expression.clone()

            this.expression.setBuildTypeSelect()

            const collection = this.getDbCollection();

            const results = this.normalizeDocuments(
                await collection.aggregate(expression.build()).toArray()
            )

            this.setExpression(previousExpression)

            return this.formatterFn ? results.map(this.formatterFn) as T : results as T
        })
    }

    /**
     * Finds multiple documents in the database using the given filter.
     *
     * @param filter The filter to use for the query.
     * @returns A promise resolving to the found documents.
     */
    async findMany<T = NonNullable<Model['attributes']>[]>(filter: object): Promise<T> {
        return await captureError<T>(async () => {

            this.expression.setBuildTypeSelect()

            const collection = this.getDbCollection();

            const results  = this.normalizeDocuments(
                await collection.find(filter).toArray()
            )

            return this.formatterFn ? results.map(this.formatterFn) as T : results as T
        })
    }

    /**
     * Finds a single document by its id.
     * @param id The id of the document to find
     * @returns A promise resolving to the found document, or null if not found
     */
    async find(id: string | number): Promise<Model | null> {
        let objectId: ObjectId | string | number;

        try {
            objectId = this.denormalizeId(id)
        }
        // eslint-disable-next-line no-unused-vars
        catch (err) {
            objectId = id
        }

        return await captureError<Model | null>(async () => {

            const collection = this.getDbCollection();
            
            const document = await collection.findOne({ _id: objectId } as object)
            
            if(!document) {
                return null
            }

            const normalizedDocument = this.normalizeDocuments(document)[0]

            return (this.formatterFn ? this.formatterFn(normalizedDocument) : normalizedDocument) as Model
        })
    }

    /**
     * Finds a single document by its id or throws an exception if not found.
     * 
     * @param id The id of the document to find
     * @returns A promise resolving to the found document
     * @throws ModelNotFound if no document is found with the given id
     */
    async findOrFail(id: string | number): Promise<Model> {
        const document = await this.find(id)
        
        if(!document) {
            throw new ModelNotFound('Document not found')
        }

        return document
    }

    async first(): Promise<Model | null> {
        return await captureError(async () => {

            const previousExpression = this.expression.clone()

            this.expression.setBuildTypeSelect()
            this.expression.setLimit(1)

            const documents = await this.raw(this.expression.build())

            const results = this.normalizeDocuments(documents)

            this.setExpression(previousExpression)

            if(results.length === 0) {
                return null
            }

            return (this.formatterFn ? this.formatterFn(results[0]) : results[0]) as Model
        })
    }

    async firstOrFail(): Promise<Model> {
        const document = await this.first()
        
        if(!document) {
            throw new ModelNotFound('Document not found')
        }

        return document
    }

    async last(): Promise<Model | null> {
        return await captureError(async () => {

            const previousExpression = this.expression.clone()

            this.expression.setBuildTypeSelect()

            const documents = await this.get()

            this.setExpression(previousExpression)

            if(documents.isEmpty()) {
                return null
            }

            return documents.last()
        })
    }

    async lastOrFail(): Promise<Model> {
        const document = await this.last()
        
        if(!document) {
            throw new ModelNotFound('Document not found')
        }

        return document
    }

    /**
     * Retrieves a collection of documents from the database using the query builder expression.
     * @returns A promise resolving to a collection of documents
     */
    async get(): Promise<Collection<Model>> {
        return await captureError(async () => {

            const previousExpression = this.expression.clone()

            this.expression.setBuildTypeSelect()

            const documents = await this.raw(this.expression.build())

            const results = this.normalizeDocuments(documents)

            this.setExpression(previousExpression)

            return collect<Model>(
                (this.formatterFn ? results.map(this.formatterFn) : results) as Model[]
            )
        })
    }

    /**
     * Retrieves all documents from the database using the query builder expression.
     * @returns A promise resolving to a collection of documents
     */
    async all(): Promise<Collection<Model>> {
        return await captureError(async () => {

            const previousExpression = this.expression.clone()

            this.expression.setBuildTypeSelect()
            this.expression.setWhere(null)
            this.expression.setRawWhere(null)

            const documents = await this.raw(this.expression.build())

            const results = this.normalizeDocuments(documents)

            this.setExpression(previousExpression)

            return collect<Model>(
                (this.formatterFn ? results.map(this.formatterFn) : results) as Model[]
            )
        })
    }

    /**
     * Inserts documents into the database and returns a collection of inserted models.
     * @param documents - The documents to insert
     * @returns A collection of inserted models
     */
    async insert(documents: object | object[]): Promise<Collection<Model>> {
        return captureError(async () => {

            const collection = this.getDbCollection();

            const documentsArray = Array.isArray(documents) ? documents : [documents]

            const inserted = await collection.insertMany(documentsArray)
            const insertedIds = Object.values(inserted.insertedIds)
            const results = await this.findMany<Model[]>({ _id: { $in: insertedIds } })

            return collect<Model>(results)
        })
    }

    async update(documents: object | object[]): Promise<Collection<Model>> {
        return captureError(async () => {
            const previousExpression = this.expression.clone()

            const collection = this.getDbCollection();

            const documentsArray = Array.isArray(documents) ? documents : [documents]

            const normalizedDocuments = this.denormalizeDocuments(documentsArray)
            const normalizedDocumentsArray = Array.isArray(normalizedDocuments) ? normalizedDocuments : [normalizedDocuments]
            const filter =  this.expression.buildMatchAsFilterObject() ?? {}

            const preUpdateResults = await this.raw([
                {
                    $project: {
                        _id: 1
                    }
                },
                {
                    $match: filter
                }
            ])
            const documentIds = preUpdateResults.map(document => document._id)

            console.log('[MongoDbEloquent] update preUpdateResults', JSON.stringify(preUpdateResults, null, 2))
            console.log('[MongoDbEloquent] update preUpdateResults documentIds', { documentIds })

            console.log('[MongoDbEloquent] update filter', JSON.stringify(filter))
        
            for(const document of normalizedDocumentsArray) {
                const resultUpdate = await collection.updateOne(filter, { $set: document })
                console.log('[MongoDbEloquent] update result', resultUpdate)
            }

            this.setExpression(previousExpression)

            const postUpdateResults = await this.raw([
                {
                    $match: {
                        _id: {
                            $in: documentIds
                        }
                    }
                }
            ])

            return collect<Model>(
                (this.formatterFn ? postUpdateResults.map(this.formatterFn) : postUpdateResults) as Model[]
            )
        })
    }
    

}

export default MongoDbEloquent