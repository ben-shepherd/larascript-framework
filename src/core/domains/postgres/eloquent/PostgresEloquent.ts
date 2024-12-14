import ModelNotFound from "@src/core/exceptions/ModelNotFound";
import { ICtor } from "@src/core/interfaces/ICtor";
import { IModel } from "@src/core/interfaces/IModel";
import captureError from "@src/core/util/captureError";
import PrefixedPropertyGrouper from "@src/core/util/PrefixedPropertyGrouper";
import { generateUuidV4 } from "@src/core/util/uuid/generateUuidV4";
import pg, { QueryResult } from 'pg';

import Collection from "../../collections/Collection";
import collect from "../../collections/helper/collect";
import Eloquent from "../../eloquent/Eloquent";
import EloquentException from "../../eloquent/exceptions/EloquentExpression";
import UpdateException from "../../eloquent/exceptions/UpdateException";
import { IEloquent, IdGeneratorFn, SetModelColumnsOptions, TransactionFn } from "../../eloquent/interfaces/IEloquent";
import IEloquentExpression from "../../eloquent/interfaces/IEloquentExpression";
import PostgresAdapter from "../adapters/PostgresAdapter";
import SqlExpression from "../builder/ExpressionBuilder/SqlExpression";

class PostgresEloquent<Model extends IModel> extends Eloquent<Model> {

    /**
     * The query builder expression object
     */
    protected expression!: SqlExpression

    /**
     * The default ID generator function for the query builder.
     */
    protected defaultIdGeneratorFn = generateUuidV4;

    /**
     * The query builder client
     */
    protected client: pg.Pool | null = null

    /**
     * Constructor
     * @param modelCtor The model constructor to use when creating or fetching models.
     */
    constructor() {
        super()
        this.setExpressionCtor(SqlExpression)
        this.client = this.getAdapter<PostgresAdapter>().getClient();
    }

    setClient(client: pg.Pool) {
        this.client = client
    }

    /**
     * Resets the bindings array to an empty array.
     * This is useful if you intend to reuse the same query builder instance
     * for multiple queries.
     * @returns {this} The PostgresEloquent instance for chaining.
     */
    protected resetBindingValues() {
        this.expression.bindings.reset()
    }

    /**
     * Sets the ID generator function for the query builder.
     *
     * If no ID generator function is provided, the default ID generator function
     * will be used, which generates a UUID v4 string.
     *
     * @param {IdGeneratorFn} [idGeneratorFn] - The ID generator function to use.
     * @returns {this} The PostgresEloquent instance for chaining.
     */
    setIdGenerator(idGeneratorFn: IdGeneratorFn = this.defaultIdGeneratorFn as IdGeneratorFn): IEloquent<Model> {
        this.idGeneratorFn = idGeneratorFn
        return this
    }


    /**
     * Sets the model columns for the query builder.
     * If a model constructor is provided, the model's columns will be used.
     * If a prefix is provided, the columns will be prefixed with the given string.
     * If `options.targetProperty` is provided, the columns will be formatted to
     * access the property of the model under the given key.
     * @param {ICtor<IModel>} [modelCtor] - The model constructor to use for retrieving the columns.
     * @param {string} [prefix] - The prefix to add to the columns.
     * @param {SetModelColumnOptions} [options] - Options object containing the targetProperty to format the columns with.
     * @returns {this} The PostgresEloquent instance for chaining.
     */
    setModelColumns(modelCtor?: ICtor<IModel>, options?: SetModelColumnsOptions): IEloquent<Model> {
        super.setModelColumns(modelCtor, options)
        
        // Store the options for formatting the result rows to objects with a target property.
        // This will be used when calling fetchRows() to format the result rows to objects with the target property.
        if(options?.columnPrefix && typeof options?.targetProperty === 'string') {
            this.formatResultTargetPropertyToObjectOptions.push({columnPrefix: options.columnPrefix, targetProperty: options.targetProperty, setTargetPropertyNullWhenObjectAllNullish: true })
        }

        return this as unknown as IEloquent<Model>
    }

    /**
     * Executes a SQL expression using the connected PostgreSQL client.
     *
     * @param {SqlExpression} expression - The SQL expression builder instance containing the query to execute.
     * @returns {Promise<T>} A promise that resolves with the query result.
     * @private
     */
    async execute<T = QueryResult>(expression: IEloquentExpression = this.expression): Promise<T> {
        const sql = expression.build<string>()
        const values = expression.getBindingValues()

        return await this.raw<T>(sql, values)
    }

    /**
     * Executes a SQL expression using the connected PostgreSQL client.
     * 
     * This method builds the SQL query from the given expression and executes it using the connected PostgreSQL client.
     * The result of the query is returned as a promise.
     * 
     * @param {SqlExpression} [expression] - The SQL expression builder instance containing the query to execute. If not provided, the query builder's expression instance is used.
     * @returns {Promise<T>} A promise that resolves with the query result.
     * @throws {QueryException} If the query execution fails.
     * @private
     */
    async fetchRows<T = QueryResult>(expression: IEloquentExpression = this.expression): Promise<T> {
        const res = await this.execute(expression)
        // Map the result to move prefixed columns to the target property
        res.rows = PrefixedPropertyGrouper.handleArray<object>(res.rows, this.formatResultTargetPropertyToObjectOptions)
        // Apply formatter
        res.rows = this.formatterFn ? res.rows.map(this.formatterFn) : res.rows
        return res as T 
    }

    /**
     * Retrieves the PostgreSQL client instance connected to the database.
     * This is a protected method, intended to be used by subclasses of PostgresEloquent.
     * @returns {pg.Client} The PostgreSQL client instance.
     */
    protected getClient() { 
        return this.getAdapter<PostgresAdapter>().getClient()
    }

    /**
     * Executes a raw SQL query using the connected PostgreSQL client.
     *
     * @param expression The SQL query to execute.
     * @param bindings The bindings to use for the query.
     * @returns A promise that resolves with the query result.
     */
    async raw<T = QueryResult>(expression: string, bindings?: unknown[]): Promise<T> {
        console.log('[PostgresEloquent] raw', { expression, bindings })

        const results = await this.getClient().query(expression, bindings)

        console.log('[PostgresEloquent] raw results count', results?.rows?.length)

        this.expression.bindings.reset()

        return results as T
    }

    /**
     * Find a model by its id
     *
     * @param id The id of the model to find
     * @returns A promise resolving to the found model, or null if not found
     */
    async find(id: string | number): Promise<Model | null> {
        return await captureError<Model | null>(async () => {
            this.expression.setSelect()
            
            const res = await this.fetchRows(
                this.expression
                    .setWhere([])
                    .where('id', '=', id)
            )

            return res.rows[0] ?? null
        })
    }

    /**
     * Find or fail if no document found
     * @param id The id of the document to find
     * @returns The found model or throws a ModelNotFound exception
     * @throws ModelNotFound
     */
    async findOrFail(id: string | number): Promise<Model> {
        const result = await this.find(id)

        if(!result) {
            throw new ModelNotFound()
        }

        return result
    }

    /**
     * Retrieves the first document from the query builder or throws a ModelNotFound exception
     * if no documents are found.
     * 
     * @returns A promise resolving to the first document found or throwing a ModelNotFound
     * exception if none were found.
     * @throws ModelNotFound
     */
    async firstOrFail(): Promise<Model> {
        const result = await this.first()

        if(!result) {
            throw new ModelNotFound()
        }

        return result
    }

    /**
     * Retrieves the first document from the query builder or null if no documents
     * are found.
     * 
     * @returns A promise resolving to the first document found or null if none
     * were found.
     */
    async first(): Promise<Model | null> {
        return await captureError<Model | null>(async () => {
            this.expression.setSelect()

            const previousLimit = this.expression.getOffsetLimit()

            const res = await this.fetchRows(
                this.expression.setOffsetAndLimit({ limit: 1})
            )

            // Reset the limit to the previous value
            this.expression.setOffsetAndLimit(previousLimit)

            return res.rows[0] ?? null
        })
    }

    /**
     * Retrieves the last document from the query builder or throws a ModelNotFound exception
     * if no documents are found.
     * 
     * @returns A promise resolving to the last document found or throwing a ModelNotFound
     * exception if none were found.
     * @throws ModelNotFound
     */
    async lastOrFail(): Promise<Model> {
        const result = await this.last()

        if(!result) {
            throw new ModelNotFound()
        }

        return result
    }

    /**
     * Retrieves the last document from the query builder or null if no documents
     * are found.
     * 
     * @returns A promise resolving to the last document found or null if none
     * were found.
     */
    async last(): Promise<Model | null> {
        return await captureError<Model | null>(async () => {
            this.expression.setSelect()
            
            const res = await this.fetchRows()
            
            if(res.rows.length === 0) {
                return null
            }

            return res.rows[res.rows.length - 1] ?? null
        })
    }

    /**
     * Executes the query built by the query builder and retrieves a collection
     * of documents matching the specified query criteria.
     * 
     * @returns A promise resolving to a collection of documents.
     */
    async get(): Promise<Collection<Model>> {
        return await captureError(async () => {
            this.expression.setSelect()

            const res = await this.fetchRows()

            this.resetBindingValues()

            return collect<Model>(res.rows)
        })
    }

    /**
     * Retrieves all documents from the query builder without any pagination.
     * 
     * This method is similar to {@link get}, but it will not apply any
     * pagination to the query. It is useful when you need to retrieve all
     * documents from the database without any limit.
     * 
     * @returns A promise resolving to a collection of documents.
     */
    async all(): Promise<Collection<Model>> {
        return await captureError(async () => {
            this.expression.setSelect()

            const res = await this.fetchRows(
                this.expression
                    .setWhere([])
                    .setOffsetAndLimit(null)
            )

            return collect<Model>(res.rows)
        })
    }

    /**
     * Inserts one or multiple documents into the database.
     * 
     * @param documents The document(s) to be inserted.
     * @returns A promise resolving to a collection of the inserted documents.
     */
    async insert(documents: object | object[]): Promise<Collection<Model>> {
        return await captureError(async () => {

            const previousExpression = this.expression.clone() as SqlExpression

            const documentsArray = Array.isArray(documents) ? documents : [documents]
            const results: unknown[] = [];

            for(const document of documentsArray) {

                this.setExpression(previousExpression)

                const documentWithId = this.documentWithGeneratedId<Model>(document);

                const res = await this.execute(
                    this.expression
                        .setInsert(documentWithId as object)
                )
                
                results.push(res.rows[0])    
            }

            this.setExpression(previousExpression)

            return collect<Model>(
                this.applyFormatter(results)
            )
        })
    }

    /**
     * Updates one or multiple documents in the database.
     * 
     * @param documents The document(s) to be updated.
     * @returns A promise resolving to a collection of the updated documents.
     */
    async update(documents: object | object[]): Promise<Collection<Model>> {
        return await captureError(async () => {

            const documentsArray: object[] = Array.isArray(documents) ? documents : [documents]

            if(documentsArray.length === 0) { 
                throw new UpdateException()
            }

            for(const document of documentsArray) {
                await this.clone().execute(
                    this.expression
                        .setUpdate(document)
                )
            }

            // Reset the binding values
            this.resetBindingValues()

            return await this.get()
        })
    }

    /**
     * Updates multiple documents in the database without any where clause.
     * 
     * @param documents The documents to be updated.
     * @returns A promise resolving to a collection of the updated documents.
     */
    async updateAll(documents: object | object[]): Promise<Collection<Model>> {
        this.expression.setWhere([])
        return await this.update(documents)
    }
    
    /**
     * Deletes records from the database based on the current query builder state.
     * 
     * @returns {Promise<IEloquent<Model>>} A promise that resolves to the query builder instance
     * for chaining after the deletion operation.
     * 
     * @throws {DeleteException} Throws an exception if the query builder state is invalid.
     */
    async delete(): Promise<IEloquent<Model>> {
        return await captureError(async () => {

            const previousExpression = this.expression.clone() as SqlExpression

            this.expression.setDelete()

            await this.execute();

            this.setExpression(previousExpression)

            return this
        })
    }

    /**
     * Executes a count query to retrieve the number of documents matching the
     * query criteria.
     * 
     * @returns A promise resolving to the count of the documents.
     */
    async count(column: string | null = null): Promise<number> {
        return await this.fetchAggregateResultNumber(`COUNT(${column ?? '*'}) AS aggregate_result`)
    }

    /**
     * Calculates the minimum of the specified column and returns it as a Promise.
     * 
     * @param {string} column The column to calculate the minimum for.
     * @returns {Promise<number>} A promise resolving to the minimum of the specified column.
     */
    async min(column: string): Promise<number> {
        return await this.fetchAggregateResultNumber(`MIN(${column}) AS aggregate_result`)
    }

    /**
     * Calculates the maximum of the specified column and returns it as a Promise.
     * 
     * @param {string} column The column to calculate the maximum for.
     * @returns {Promise<number>} A promise resolving to the maximum of the specified column.
     */
    
    async max(column: string): Promise<number> {
        return await this.fetchAggregateResultNumber(`MAX(${column}) AS aggregate_result`)
    }

    /**
     * Calculates the average of the specified column and returns it as a Promise.
     * 
     * @param {string} column The column to calculate the average for.
     * @returns {Promise<number>} A promise resolving to the average of the specified column.
     */
    async avg(column: string): Promise<number> {
        return await this.fetchAggregateResultNumber(`AVG(${column}) AS aggregate_result`)
    }

    /**
     * Calculates the sum of the specified column and returns it as a Promise.
     *
     * @param {string} column - The column to calculate the sum for.
     * @returns {Promise<number>} A promise resolving to the sum of the specified column.
     */
    async sum(column: string): Promise<number> {
        return await this.fetchAggregateResultNumber(`SUM(${column}) AS aggregate_result`)
    }

    /**
     * Executes a database transaction, allowing a series of operations to be
     * executed with rollback capability in case of errors.
     *
     * @param {TransactionFn} callbackFn - The function to execute within the transaction.
     * It receives a query instance to perform database operations.
     * @returns {Promise<void>} A promise that resolves once the transaction completes.
     * @throws {Error} Throws an error if the transaction fails, in which case a rollback is performed.
     */
    async transaction(callbackFn: TransactionFn<Model>): Promise<void> {
        let pgClient!: pg.PoolClient;

        try {
            const pool = this.getAdapter<PostgresAdapter>().getClient();
            pgClient = await pool.connect();

            // Begin the transaction
            await this.getClient().query('BEGIN');

            // Execute the callback function
            await captureError(async () => {
                const query = this.clone() as PostgresEloquent<Model>;
                query.setClient(pgClient as unknown as pg.Pool);
                await callbackFn(query as unknown as IEloquent<Model>);
            })

            // Commit the transaction
            await this.getClient().query('COMMIT');
        }
        catch (err) {
            // Rollback the transaction
            if(pgClient) {
                await pgClient.query('ROLLBACK');
            }
            throw err
        }
        finally {
            // Close the client
            if(pgClient) {
                pgClient.release();
            }
        }
    }

    /**
     * Executes a raw query to retrieve a single number from the database
     * and returns it as a Promise.
     * 
     * @param {string} selectRaw The raw SQL to execute.
     * @param {string} [targetProperty] The property to retrieve from the result.
     * @returns {Promise<number>} A promise resolving to the result of the query.
     * @throws {EloquentException} If the query result is null or undefined.
     * @private
     */
    protected async fetchAggregateResultNumber(selectRaw: string, targetProperty: string = 'aggregate_result'): Promise<number> {
        return await captureError(async () => {
            
            const previousExpression = this.expression.clone() as SqlExpression

            this.expression.setSelect()
            this.selectRaw(selectRaw)
            this.groupBy(null)
            this.orderBy(null)
            this.offset(null)
            
            const res = await this.execute()
            
            const result = res.rows?.[0]?.[targetProperty] ?? null;

            if(!result) {
                throw new EloquentException(`${targetProperty} is null`)
            }

            this.setExpression(previousExpression)

            return parseFloat(result)
        })
    }

    /**
     * Sets the distinct columns for the query builder.
     * 
     * @param {string|string[]} [columns] The columns to set for distinct.
     * @returns {this} The query builder instance.
     */
    groupBy(columns: string[] | string | null): IEloquent<Model> {
        const columnsArray = Array.isArray(columns) ? columns : [columns]
        this.expression.setDistinctColumns(columnsArray.map(column => ({column})))
        return this as unknown as IEloquent<Model>
    }


}

export default PostgresEloquent;