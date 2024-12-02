import ModelNotFound from "@src/core/exceptions/ModelNotFound";
import { ICtor } from "@src/core/interfaces/ICtor";
import captureError from "@src/core/util/captureError";
import { QueryResult, types } from "pg";

import Collection from "../../collections/Collection";
import collect from "../../collections/helper/collect";
import Eloquent from "../../eloquent/Eloquent";
import UpdateException from "../../eloquent/exceptions/UpdateException";
import { IEloquent } from "../../eloquent/interfaces/IEloquent";
import IEloquentExpression from "../../eloquent/interfaces/IEloquentExpression";
import PostgresAdapter from "../adapters/PostgresAdapter";
import SqlExpression from "../builder/ExpressionBuilder/SqlExpression";

class PostgresEloquent<Data = unknown> extends Eloquent<Data, PostgresAdapter, SqlExpression> {

    /**
     * Constructor
     * @param modelCtor The model constructor to use when creating or fetching models.
     */
    constructor() {
        super()
        this.setExpressionCtor(SqlExpression)
    }

    setExpressionCtor(builderCtor: ICtor<SqlExpression>): IEloquent<Data> {
        super.setExpressionCtor(builderCtor)
        this.expression.bindings.setColumnType('id', types.builtins.UUID)
        return this as IEloquent<Data>
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
     * Executes a raw SQL query using the connected PostgreSQL client.
     *
     * @param expression The SQL query to execute.
     * @param bindings The bindings to use for the query.
     * @returns A promise that resolves with the query result.
     */
    async raw<T = QueryResult>(expression: string, bindings?: unknown[]): Promise<T> {
        console.log('[PostgresEloquent] raw', expression, bindings);

        const client = await this.getAdapter().getConnectedPgClient();
        const results = await client.query(expression, bindings)
        await client.end()

        return results as T
    }

    /**
     * Find a model by its id
     *
     * @param id The id of the model to find
     * @returns A promise resolving to the found model, or null if not found
     */
    async find(id: string | number): Promise<Data | null> {
        return await captureError<Data | null>(async () => {
    
            const res = await this.execute(
                this.expression
                    .setWhere([])
                    .where('id', '=', id)
            )

            return this.formatQueryResults(res.rows)[0] ?? null
        })
    }

    /**
     * Find or fail if no document found
     * @param id The id of the document to find
     * @returns The found model or throws a ModelNotFound exception
     * @throws ModelNotFound
     */
    async findOrFail(id: string | number): Promise<Data> {
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
    async firstOrFail(): Promise<Data> {
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
    async first(): Promise<Data | null> {
        return await captureError<Data | null>(async () => {
    
            const previousLimit = this.expression.getOffsetLimit()

            const res = await this.execute(
                this.expression.setOffsetAndLimit({ limit: 1})
            )

            // Reset the limit to the previous value
            this.expression.setOffsetAndLimit(previousLimit)

            return this.formatQueryResults(res.rows)[0] ?? null
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
    async lastOrFail(): Promise<Data> {
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
    async last(): Promise<Data | null> {
        return await captureError<Data | null>(async () => {
            const res = await this.execute()
            
            if(res.rows.length === 0) {
                return null
            }

            return this.formatQueryResults(res.rows)[res.rows.length - 1] ?? null
        })
    }

    /**
     * Executes the query built by the query builder and retrieves a collection
     * of documents matching the specified query criteria.
     * 
     * @returns A promise resolving to a collection of documents.
     */
    async get(): Promise<Collection<Data>> {
        return await captureError(async () => {
            const res = await this.execute()

            this.resetBindingValues()

            return collect<Data>(
                this.formatQueryResults(res.rows)
            )
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
    async all(): Promise<Collection<Data>> {
        return await captureError(async () => {
            const res = await this.execute(
                this.expression
                    .setWhere([])
                    .setOffsetAndLimit(null)
            )

            return collect<Data>(
                this.formatQueryResults(res.rows)
            )
        })
    }

    /**
     * Inserts one or multiple documents into the database.
     * 
     * @param documents The document(s) to be inserted.
     * @returns A promise resolving to a collection of the inserted documents.
     */
    async insert(documents: object | object[]): Promise<Collection<Data>> {
        return await captureError(async () => {

            const documentsArray = Array.isArray(documents) ? documents : [documents]
            const results: unknown[] = [];

            for(const document of documentsArray) {

                this.resetExpression()

                const documentWithUuid = this.documentWithUuid<Data>(document);

                const res = await this.execute(
                    this.expression
                        .setInsert(documentWithUuid as object)
                )
                
                results.push(this.formatQueryResults(res.rows)[0])    
            }

            this.resetExpression()

            return collect<Data>(
                this.formatQueryResults(results)
            )
        })
    }

    /**
     * Updates one or multiple documents in the database.
     * 
     * @param documents The document(s) to be updated.
     * @returns A promise resolving to a collection of the updated documents.
     */
    async update(documents: object | object[]): Promise<Collection<Data>> {
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

            // Reset the expression to 'select'
            this.expression.setSelect()

            return await this.get()
        })
    }

    /**
     * Updates multiple documents in the database without any where clause.
     * 
     * @param documents The documents to be updated.
     * @returns A promise resolving to a collection of the updated documents.
     */
    async updateAll(documents: object | object[]): Promise<Collection<Data>> {
        this.expression.setWhere([])
        return await this.update(documents)
    }

}

export default PostgresEloquent;