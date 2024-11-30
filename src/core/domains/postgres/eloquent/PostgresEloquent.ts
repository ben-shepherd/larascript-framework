import ModelNotFound from "@src/core/exceptions/ModelNotFound";
import captureError from "@src/core/util/captureError";
import { QueryResult } from "pg";

import Collection from "../../collections/Collection";
import collect from "../../collections/helper/collect";
import Eloquent from "../../eloquent/Eloquent";
import IEloquentExpression from "../../eloquent/interfaces/IEloquentExpression";
import PostgresAdapter from "../adapters/PostgresAdapter";
import SqlExpression from "../builder/ExpressionBuilder/SqlExpression";

class PostgresEloquent<Data = unknown> extends Eloquent<Data, PostgresAdapter> {

    /**
     * Constructor
     * @param modelCtor The model constructor to use when creating or fetching models.
     */
    constructor(connectionName: string) {
        super({
            adapterName: 'postgres',
            connectionName: connectionName,
            expressionCtor: SqlExpression
        })
    }

    /**
     * Executes a SQL expression using the connected PostgreSQL client.
     *
     * @param {SqlExpression} expression - The SQL expression builder instance containing the query to execute.
     * @returns {Promise<T>} A promise that resolves with the query result.
     * @private
     */
    async execute<T = QueryResult>(expression: IEloquentExpression = this.expression): Promise<T> {
        console.log('[PostgresEloquent]', {expression: expression.build<string>(), bindings: expression.getBindings()})
        
        const client = await this.getDatabaseAdapter().getConnectedPgClient();
        const results = await client.query(expression.build<string>(), expression.getBindings())
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
     * Retrieves the first document from the query builder or null if no documents
     * are found.
     * 
     * @returns A promise resolving to the first document found or null if none
     * were found.
     */
    async first(): Promise<Data | null> {
        return await captureError<Data | null>(async () => {
    
            const res = await this.execute(
                this.expression.setOffsetAndLimit({ limit: 1})
            )

            return this.formatQueryResults(res.rows)[0] ?? null
        })
    }

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

            return collect<Data>(
                this.formatQueryResults(res.rows)
            )
        })
    }

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

            return collect<Data>(
                this.formatQueryResults(results)
            )
        })
    }

}

export default PostgresEloquent;