import ModelNotFound from "@src/core/exceptions/ModelNotFound";
import { IModel } from "@src/core/interfaces/IModel";
import captureError from "@src/core/util/captureError";
import { Document, Collection as MongoCollection, ObjectId } from "mongodb";

import Collection from "../../collections/Collection";
import collect from "../../collections/helper/collect";
import Eloquent from "../../eloquent/Eloquent";
import EloquentException from "../../eloquent/exceptions/EloquentExpression";
import { IEloquent } from "../../eloquent/interfaces/IEloquent";
import IEloquentExpression from "../../eloquent/interfaces/IEloquentExpression";
import { logger } from "../../logger/services/LoggerService";
import MongoDbAdapter from "../adapters/MongoDbAdapter";
import AggregateExpression from "../builder/AggregateExpression";

/**
 * Represents a MongoDB document with an ObjectId _id field and model attributes.
 * Excludes the 'id' field from the model attributes and makes _id required.
 * @template Model The model type extending IModel
 */

export type ModelAttributesWithObjectId<Model extends IModel> = NonNullable<Omit<Model['attributes'], 'id'> & { _id: ObjectId }>
// eslint-disable-next-line no-unused-vars
export type DocumentWithId<Property extends string = '_id'> = Document & { [key in Property]: ObjectId }

/**
 * MongoDB-specific implementation of the Eloquent ORM.
 * Provides MongoDB-specific functionality for querying and manipulating documents.
 * 
 * @template Model The model type extending IModel that this eloquent instance works with
 * @extends {Eloquent<Model, AggregateExpression, MongoDbAdapter>}
 * 
 * @example
 * ```typescript
 * class UserModel extends Model {
 *   // Model definition
 * }
 * 
 * const query = queryBuilder(UserModel)
 * const users = await query.where('age', '>', 18).get();
 * ```
 */
class MongoDbEloquent<Model extends IModel> extends Eloquent<Model, AggregateExpression, MongoDbAdapter> {

    /**
     * The query builder expression object
     */
    protected expression: AggregateExpression = new AggregateExpression()

    /**
     * Retrieves the MongoDB Collection instance for the model.
     * @param collectionName Optional collection name to use. If not provided, the model's table name will be used.
     * @returns The MongoDB Collection instance.
     * @throws Error if the model constructor is not set.
     */
    getMongoCollection(collectionName?: string): MongoCollection {
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
     * Normalizes MongoDB documents by converting _id fields to standard id format.
     * If the _id field is an ObjectId, it is converted to string.
     * The original _id field is removed from the document.
     * Also filters out columns not specified in the expression.
     *
     * @param documents - Single document or array of documents to normalize
     * @returns Array of normalized documents with standard id fields
     */
    normalizeDocuments(documents: Document | Document[]): Document[] {

        // Get the documents array  
        let documentsArray = Array.isArray(documents) ? documents : [documents]

        // Normalize the documents
        documentsArray = documentsArray.map(document => {
            if(document._id) {
                document.id = this.normalizeId(document._id)
                delete document._id
            }
            return document
        })

        // Filter out columns that specified in the expression
        const columnsArray = this.expression.getColumns().map(option => option.column).filter(col => col) as string[]
        documentsArray.map((document) => {
            columnsArray.forEach(column => {
                if(!document[column]) {
                    delete document[column]
                }
            })
        })

        return documentsArray
    }

    /*
    * Denormalizes document IDs by converting standard id fields back to MongoDB's _id format.
    * If the `id` field is a string, it is converted to ObjectId.
    * The original `id` field is removed from the document.
    *
    * @param document - The document to denormalize
    * @returns Document with MongoDB compatible _id field
    */
    denormalizeDocuments(document: Document | Document[]): Document[] {
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
     * Normalizes the id property to the MongoDB _id property.
     * @param property The property to normalize
     * @returns The normalized property
     */
    normalizeIdProperty(property: string): string {
        return property === 'id' ? '_id' : property
    }

    protected genericJoin(relatedTable: string, localColumn: string, relatedColumn: string): this {
        super.join(relatedTable, this.normalizeIdProperty(localColumn), this.normalizeIdProperty(relatedColumn))
        this.expression.addColumn({
            column: relatedTable,
        })
        this.expression.addPipelineStage([
            {
                "$unwind": {
                    "path": `$${relatedTable}`,
                    "preserveNullAndEmptyArrays": true
                }
            }
        ])
        return this
    }

    /**
     * Adds a join unwind stage to the pipeline
     * @param relatedTable The name of the related table to join
     */
    protected addJoinUnwindStage(relatedTable: string): void {
        this.expression.addColumn({
            column: relatedTable,
        })
        this.expression.addPipelineStage([
            {
                "$unwind": {
                    "path": `$${relatedTable}`,
                    "preserveNullAndEmptyArrays": true
                }
            }
        ])
    }

    /**
     * Joins a related table to the current query.
     * @param relatedTable The name of the related table to join
     * @param localColumn The local column to join on
     * @param relatedColumn The related column to join on
     * @returns The current query builder instance
     */
    join(relatedTable: string, localColumn: string, relatedColumn: string): IEloquent<Model, IEloquentExpression<unknown>> {

        super.join(relatedTable, this.normalizeIdProperty(localColumn), this.normalizeIdProperty(relatedColumn))
        this.addJoinUnwindStage(relatedTable)

        return this
    }

    leftJoin(relatedTable: string, localColumn: string, relatedColumn: string): IEloquent<Model, IEloquentExpression<unknown>> {
        super.leftJoin(relatedTable, this.normalizeIdProperty(localColumn), this.normalizeIdProperty(relatedColumn))
        this.addJoinUnwindStage(relatedTable)
        return this
    }

    rightJoin(relatedTable: string, localColumn: string, relatedColumn: string): IEloquent<Model, IEloquentExpression<unknown>> {
        super.rightJoin(relatedTable, this.normalizeIdProperty(localColumn), this.normalizeIdProperty(relatedColumn))
        this.addJoinUnwindStage(relatedTable)
        return this
    }

    fullJoin(relatedTable: string, localColumn: string, relatedColumn: string): IEloquent<Model, IEloquentExpression<unknown>> {
        super.fullJoin(relatedTable, this.normalizeIdProperty(localColumn), this.normalizeIdProperty(relatedColumn))
        this.addJoinUnwindStage(relatedTable)
        return this
    }

    // crossJoin(relatedTable: string, localColumn: string, relatedColumn: string): IEloquent<Model, IEloquentExpression<unknown>> {
    //     super.crossJoin(relatedTable, localColumn, relatedColumn)
    //     this.expression.addColumn({
    //         column: relatedTable,
    //     })
    //     return this
    // }

    /**
     * Executes a raw MongoDB aggregation query and returns the results.
     * @param aggregationPipeline - The aggregation pipeline to execute
     * @returns The results of the aggregation query
     */
    async raw<T = ModelAttributesWithObjectId<Model>[]>(aggregationPipeline?: object[]): Promise<T> {
        return captureError<T>(async () => {

            // Get the pipeline
            if(!aggregationPipeline) {
                aggregationPipeline = this.expression.build()
            }

            logger().console('[MongoDbEloquent.raw] aggregationPipeline', JSON.stringify(aggregationPipeline))

            // Get the collection
            const collection = this.getMongoCollection();

            // Get the results
            return await collection.aggregate(aggregationPipeline).toArray() as T;
        })
    }

    /**
     * Executes a MongoDB aggregation pipeline using the provided pipeline builder expression.
     * Normalizes the results and applies any configured formatters.
     * 
     * @template T The expected return type, defaults to array of model attributes
     * @param {AggregateExpression} [expression] The pipeline builder expression to execute. If not provided, uses the instance's expression.
     * @returns {Promise<T>} A promise that resolves with the query results
     * @throws {QueryException} If the query execution fails
     * @private
     */
    async fetchRows<T = NonNullable<Model['attributes']>[]>(expression: AggregateExpression = this.expression): Promise<T> {
        return await captureError<T>(async () => {

            // Get the previous expression
            const previousExpression = this.expression.clone()

            // Set the build type to select
            this.expression.setBuildTypeSelect()

            // Get the collection
            const collection = this.getMongoCollection();

            // Get the results
            const results = this.normalizeDocuments(
                await collection.aggregate(expression.build()).toArray()
            )

            // Restore the previous expression
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

            const collection = this.getMongoCollection();

            const results  = this.normalizeDocuments(
                await collection.find(filter).toArray()
            )

            return results as T
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

            // Get the collection
            const collection = this.getMongoCollection();

            // Get the document
            const document = await collection.findOne({ _id: objectId } as object)
            
            if(!document) {
                return null
            }

            // Normalize the document
            const normalizedDocument = this.normalizeDocuments(document)[0]

            // Return the document
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

    /**
     * Gets the first document matching the current query conditions.
     * @returns Promise resolving to the first matching document or null if none found
     */
    async first(): Promise<Model | null> {
        return await captureError(async () => {

            // Get the previous expression
            const previousExpression = this.expression.clone()

            // Set the build type to select
            this.expression.setBuildTypeSelect()
            this.expression.setLimit(1)

            // Get the documents
            const documents = await this.raw()

            // Normalize the documents
            const results = this.normalizeDocuments(documents)

            // Restore the previous expression
            this.setExpression(previousExpression)

            if(results.length === 0) {
                return null
            }

            return (this.formatterFn ? this.formatterFn(results[0]) : results[0]) as Model
        })
    }

    /**
     * Gets the first document matching the current query conditions or throws an exception if none found.
     * @returns Promise resolving to the first matching document
     * @throws ModelNotFound if no matching document is found
     */
    async firstOrFail(): Promise<Model> {
        const document = await this.first()
        
        if(!document) {
            throw new ModelNotFound('Document not found')
        }

        return document
    }

    /**
     * Gets the last document matching the current query conditions.
     * @returns Promise resolving to the last matching document or null if none found
     */
    async last(): Promise<Model | null> {
        return await captureError(async () => {

            // Get the previous expression
            const previousExpression = this.expression.clone()

            // Set the build type to select
            this.expression.setBuildTypeSelect()

            // Get the documents
            const documents = await this.get()

            // Restore the previous expression
            this.setExpression(previousExpression)

            if(documents.isEmpty()) {
                return null
            }

            return documents.last()
        })
    }

    /**
     * Gets the last document matching the current query conditions or throws an exception if none found.
     * @returns Promise resolving to the last matching document
     * @throws ModelNotFound if no matching document is found
     */
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

            // Get the previous expression
            const previousExpression = this.expression.clone()

            // Set the build type to select
            this.expression.setBuildTypeSelect()

            // Fetch the documents, apply the distinct filters and normalize the documents
            const results = await this.applyDistinctFilters(
                this.normalizeDocuments(
                    await this.raw()
                )
            )

            // Restore the previous expression
            this.setExpression(previousExpression)

            return collect<Model>(
                (this.formatterFn ? results.map(this.formatterFn) : results) as Model[]
            )
        })
    }

    /**
     * Applies distinct filters to the documents.
     * @param documents The documents to apply the distinct filters to
     * @returns The documents with the distinct filters applied
     */
    protected async applyDistinctFilters(documents: Document[]): Promise<Document[]> {
        if(!this.expression.getGroupBy() || this.expression.getGroupBy()?.length === 0) {
            return documents
        }
        
        const results: Document[] = []
        const collection = this.getMongoCollection();

        // Get the distinct columns
        const distinctColumns = this.expression.getGroupBy()?.map(option => option.column) ?? []

        // Apply the distinct filters on each column
        for(const column of distinctColumns) {
            const distinctValues: unknown[] = await collection.distinct(column, this.expression.buildMatchAsFilterObject() ?? {})

            // Add the documents that match the distinct values
            distinctValues.forEach(distinctValue => {
                results.push(
                    documents.find(document => document[column] === distinctValue) as Document
                )
            })
        }

        return results
    }
 
    /**
     * Retrieves all documents from the database using the query builder expression.
     * @returns A promise resolving to a collection of documents
     */
    async all(): Promise<Collection<Model>> {
        return await captureError(async () => {

            // Get the previous expression  
            const previousExpression = this.expression.clone()

            // Set the build type to select
            this.expression.setBuildTypeSelect()
            this.expression.setWhere(null)
            this.expression.setRawWhere(null)

            // Get the documents
            const documents = await this.raw(this.expression.build())

            // Normalize the documents
            const results = this.normalizeDocuments(documents)

            // Restore the previous expression
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

            // Get the collection
            const collection = this.getMongoCollection();

            // Denormalize the documents to be inserted
            const documentsArray = Array.isArray(documents) ? documents : [documents]

            // Apply the id generator function to the documents
            const normalizedDocuments = this.prepareInsertDocuments(documentsArray)

            // Insert the documents 
            const inserted = await collection.insertMany(normalizedDocuments)

            // Get the inserted ids
            const insertedIds = Object.values(inserted.insertedIds)

            // Get the results for the inserted ids
            const results = await this.findMany({ _id: { $in: insertedIds } })

            return collect<Model>(
                (this.formatterFn ? results.map(this.formatterFn) : results) as Model[]
            )
        })
    }

    /**
     * Prepares the documents for insertion by normalizing the ids and converting ObjectId properties to ObjectId instances.
     * @param documentsArray - The array of documents to prepare
     * @returns The prepared array of documents
     */
    protected prepareInsertDocuments(documentsArray: object[]): object[] {

        // Apply the id generator function to the documents
        documentsArray = documentsArray.map(document => this.idGeneratorFn ? this.idGeneratorFn(document) : document)

        // Check each property if it should be converted to an ObjectId
        documentsArray.forEach((document, index) => {
            Object.keys(document).forEach(key => {
                if(typeof document[key] === 'string' && ObjectId.isValid(document[key])) {
                    documentsArray[index][key] = new ObjectId(document[key])
                }
            })
        })

        return documentsArray
    }

    /**
     * Updates documents matching the current query conditions.
     * @param documents - Document or array of documents containing the update values
     * @returns Promise resolving to a collection of updated documents
     */
    async update(documents: object | object[]): Promise<Collection<Model>> {
        return captureError(async () => {

            const collection = this.getMongoCollection();

            // Get the match filter for the current expression
            const previousExpression = this.expression.clone()
            const matchFilter = this.expression.buildMatchAsFilterObject() ?? {}

            // Denormalize the documents to be updated
            const documentsArray = Array.isArray(documents) ? documents : [documents]
            const normalizedDocuments = this.denormalizeDocuments(documentsArray)
            const normalizedDocumentsArray = Array.isArray(normalizedDocuments) ? normalizedDocuments : [normalizedDocuments]

            // Get the pre-update results for the match filter
            const preUpdateResults = await this.raw(
                new AggregateExpression()
                    .setColumns([{ column: '_id' }])
                    .setWhere(this.expression.getWhere())
                    .setLimit(1000)
                    .build()
            )
            const preUpdateResultsDocumentIds = preUpdateResults.map(document => document._id)

            // Update each document
            for(const document of normalizedDocumentsArray) {
                await collection.updateOne(matchFilter, { $set: document })
            }

            // Get the post-update results for the match filter
            const postUpdateResults = await this.findMany({ _id: { $in: preUpdateResultsDocumentIds } })

            // Restore the previous expression
            this.setExpression(previousExpression)

            // Return the post-update results
            return collect<Model>(
                (this.formatterFn ? postUpdateResults.map(this.formatterFn) : postUpdateResults) as Model[]
            )
        })
    }

    /**
     * Updates all documents matching the current query conditions.
     * @param document - Document or array of documents containing the update values
     * @returns Promise resolving to a collection of updated documents
     */
    async updateAll(document: object): Promise<Collection<Model>> {
        return captureError(async () => {

            const collection = this.getMongoCollection();

            // Get the match filter for the current expression
            const previousExpression = this.expression.clone()
            const matchFilter = this.expression.buildMatchAsFilterObject() ?? {}

            // Denormalize the documents to be updated
            const normalizedDocument = this.denormalizeDocuments(document)?.[0] as object

            // Get the pre-update results for the match filter
            const preUpdateResults = await this.raw(
                new AggregateExpression()
                    .setColumns([{ column: '_id' }])
                    .setWhere(this.expression.getWhere())
                    .setLimit(1000)
                    .build()
            )
            const preUpdateResultsDocumentIds = preUpdateResults.map(document => document._id)
            
            // Update each document
            collection.updateMany(matchFilter, { $set: normalizedDocument })

            // Get the post-update results for the match filter
            const postUpdateResults = await this.findMany({ _id: { $in: preUpdateResultsDocumentIds } })

            // Restore the previous expression
            this.setExpression(previousExpression)

            // Return the post-update results
            return collect<Model>(
                (this.formatterFn ? postUpdateResults.map(this.formatterFn) : postUpdateResults) as Model[]
            )
        })
    }

    /**
     * Deletes documents matching the current query conditions.
     * @returns Promise resolving to a collection of deleted documents
     */
    async delete(): Promise<IEloquent<Model, AggregateExpression>> {
        await captureError(async () => {

            // Get the collection
            const collection = this.getMongoCollection();

            const previousExpression = this.expression.clone()

            // Get the pre-delete results for the match filter
            const preDeleteResults = await this.raw(
                this.expression
                    .setColumns([{ column: '_id' }])
                    .build()
            )
            const preDeleteResultsDocumentIds = preDeleteResults.map(document => document._id)

            // Get the match filter for the current expression
            const deleteFilter = { _id: { $in: preDeleteResultsDocumentIds } }

            // Delete the documents 
            await collection.deleteMany(deleteFilter)

            // Restore the previous expression
            this.setExpression(previousExpression)

        })   

        return this as unknown as IEloquent<Model, AggregateExpression>
    }

    /**
     * Counts the number of documents matching the current query conditions.
     * @returns Promise resolving to the count of documents
     */
    async count(column: string = '_id'): Promise<number> {
        return await captureError(async () => {

            // Get the previous expression
            const previousExpression = this.expression.clone()

            // Get the match filter for the current expression
            const filter = this.expression.buildMatchAsFilterObject() ?? {}
            
            // Build the pipeline
            const pipeline = new AggregateExpression()
                .addPipeline([{
                    $match: {
                        ...filter,
                        [column]: { $exists: true }
                    }
                }])
                .addPipeline([{  
                    $facet: {
                        count: [
                            { 
                                $group: {
                                    _id: null,
                                    count: { $sum: 1 }
                                }
                            }
                        ]
                    }
                }])
                .getPipeline()

            const count = await this.fetchAggregationResult(pipeline, 'count')

            // Restore the previous expression
            this.setExpression(previousExpression)

            return count
        })   
    }

    /**
     * Calculates the minimum value of a column.
     * @param column - The column to calculate the minimum value of
     * @returns Promise resolving to the minimum value of the column
     */
    async min(column: string): Promise<number> {
        return await captureError(async () => {

            // Get the previous expression
            const previousExpression = this.expression.clone()

            // Get the match filter for the current expression
            const filter = this.expression.buildMatchAsFilterObject() ?? {}
            
            // Build the pipeline
            const pipeline = new AggregateExpression()
                .addPipeline([{
                    $match: {
                        ...filter,
                        [column]: { $exists: true }
                    }
                }])
                .addPipeline([{  
                    $facet: {
                        min: [
                            { 
                                $group: {
                                    _id: null,
                                    min: { $min: `$${column}` }
                                }
                            }
                        ]
                    }
                }])
                .getPipeline()

            const min = await this.fetchAggregationResult(pipeline, 'min')

            // Restore the previous expression
            this.setExpression(previousExpression)

            return min
        })   
    }

    /**
     * Calculates the maximum value of a column.
     * @param column - The column to calculate the maximum value of
     * @returns Promise resolving to the maximum value of the column
     */
    async max(column: string): Promise<number> {
        return await captureError(async () => {

            // Get the previous expression
            const previousExpression = this.expression.clone()

            // Get the match filter for the current expression
            const filter = this.expression.buildMatchAsFilterObject() ?? {}
            
            // Build the pipeline
            const pipeline = new AggregateExpression()
                .addPipeline([{
                    $match: {
                        ...filter,
                        [column]: { $exists: true  }
                    }
                }])
                .addPipeline([{  
                    $facet: {
                        max: [
                            { 
                                $group: {
                                    _id: null,
                                    max: { $max: `$${column}` }
                                }
                            }
                        ]
                    }
                }])
                .getPipeline()

            const max = await this.fetchAggregationResult(pipeline, 'max')

            // Restore the previous expression
            this.setExpression(previousExpression)

            return max
        })   
    }

    /**
     * Calculates the sum of a column.
     * @param column - The column to calculate the sum of
     * @returns Promise resolving to the sum of the column
     */
    async sum(column: string): Promise<number> {
        return await captureError(async () => {

            // Get the previous expression
            const previousExpression = this.expression.clone()

            // Get the match filter for the current expression
            const filter = this.expression.buildMatchAsFilterObject() ?? {}
            
            // Build the pipeline
            const pipeline = new AggregateExpression()
                .addPipeline([{
                    $match: {
                        ...filter,
                        [column]: { $exists: true }
                    }
                }])
                .addPipeline([{  
                    $facet: {
                        sum: [
                            { 
                                $group: {
                                    _id: null,
                                    sum: { $sum: `$${column}` }
                                }
                            }
                        ]
                    }
                }])
                .getPipeline()

            const sum = await this.fetchAggregationResult(pipeline, 'sum')

            // Restore the previous expression
            this.setExpression(previousExpression)

            return sum
        })   
    }

    /**
     * Calculates the average of a column.
     * @param column - The column to calculate the average of
     * @returns Promise resolving to the average of the column
     */
    async avg(column: string): Promise<number> {
        return await captureError(async () => {

            // Get the previous expression
            const previousExpression = this.expression.clone()

            // Get the match filter for the current expression
            const filter = this.expression.buildMatchAsFilterObject() ?? {}
            
            // Build the pipeline
            const pipeline = new AggregateExpression()
                .addPipeline([{
                    $match: {
                        ...filter,
                        [column]: { $exists: true }
                    }
                }])
                .addPipeline([{  
                    $facet: {
                        avg: [
                            { 
                                $group: {
                                    _id: null,
                                    avg: { $avg: `$${column}` }
                                }
                            }
                        ]
                    }
                }])
                .getPipeline()

            const avg = await this.fetchAggregationResult(pipeline, 'avg')

            // Restore the previous expression
            this.setExpression(previousExpression)

            return avg
        })   
    }
    

    /**
     * Fetches the result of an aggregation pipeline stage.
     * @param aggregationPipeline - The aggregation pipeline to execute
     * @param targetProperty - The property to fetch from the result
     * @returns The result of the aggregation pipeline stage
     */
    protected async fetchAggregationResult(aggregationPipeline: object[], targetProperty: string = 'aggregate_result'): Promise<number> {
        return await captureError(async () => {

            // Get the results
            const results = await this.raw<{ [key: string]: number }>(aggregationPipeline)

            // If the count is an empty array, return 0
            if(results?.[0]?.[targetProperty] && results[0][targetProperty].length === 0) {
                return 0
            }

            // Get the aggregate result
            const aggregateResult = results?.[0]?.[targetProperty]?.[0]?.[targetProperty]

            if(typeof aggregateResult !== 'number') {
                throw new EloquentException(`Aggregate result for '${targetProperty}' could not be found`)
            }

            return aggregateResult
        })   
    }

}

export default MongoDbEloquent