import ModelNotFound from "@src/core/exceptions/ModelNotFound";
import { ICtor } from "@src/core/interfaces/ICtor";
import { IModel } from "@src/core/interfaces/IModel";
import captureError from "@src/core/util/captureError";
import { QueryResult, QueryResultRow } from "pg";

import collect from "../../collections/helper/collect";
import BaseQueryBuilder from "../../eloquent/base/BaseQueryBuilder";
import QueryBuilderException from "../../eloquent/exceptions/QueryBuilderException";
import { IQueryBuilder, ModelCollection, OperatorArray, TDirection, TOperator, TWhereClauseValue } from "../../eloquent/interfaces/IQueryBuilder";
import PostgresAdapter from "../adapters/PostgresAdapter";
import SqlExpressionBuilder from "../builder/ExpressionBuilder/SqlExpressionBuilder";

class PostgresQueryBuilder<M extends IModel = IModel> extends BaseQueryBuilder<M, PostgresAdapter> {

    /**
     * The expression builder instance
     */
    protected builder = new SqlExpressionBuilder();

    /**
     * Constructor
     * @param {ICtor<M>} modelCtor The constructor of the model to use for the query builder
     */
    constructor(modelCtor: ICtor<M>) {
        super({
            adapterName: 'postgres',
            modelCtor
        })

        this.builder.setTable(
            new modelCtor(null).table
        );
    }

    /**
     * Executes a SQL expression using the connected PostgreSQL client.
     *
     * @param {SqlExpressionBuilder} expression - The SQL expression builder instance containing the query to execute.
     * @returns {Promise<T>} A promise that resolves with the query result.
     * @private
     */
    private async executeExpression(expression: SqlExpressionBuilder) {
        const client = await this.getDatabaseAdapter().getConnectedPgClient();
        return await client.query(expression.toSql(), expression.getBindings())
    }

    private formatQueryResult<T extends QueryResultRow = QueryResultRow,R = unknown>(result: QueryResult<T>) {
        return result.rows.map(row => this.createModel(row))
    }

    /**
     * Find a model by its id
     *
     * @param id The id of the model to find
     * @returns A promise resolving to the found model, or null if not found
     */
    async find(id: string | number): Promise<M | null> {
        return await captureError<M | null>(async () => {
    
            const res = await this.executeExpression(
                this.builder.where('id', '=', id)
            )

            return this.formatQueryResult(res)[0] ?? null
        })
    }

    /**
     * Find or fail if no document found
     * @param id The id of the document to find
     * @returns The found model or throws a ModelNotFound exception
     * @throws ModelNotFound
     */
    async findOrFail(id: string | number): Promise<M> {
        const result = await this.find(id)

        if(!result) {
            throw new ModelNotFound()
        }

        return result
    }

    async first(): Promise<M | null> {
        return null
    }

    where(column: string, operator?: TOperator, value?: TWhereClauseValue): IQueryBuilder<M> {

        // Handle default equals case
        if(value === undefined && typeof operator === 'string') {
            this.builder.where(column, '=', operator as TWhereClauseValue);
            return this
        }

        // Check operator has been provided and matches expected value
        if(operator === undefined || OperatorArray.includes(operator) === false) {
            throw new QueryBuilderException('Operator is required')
        }

        this.builder.where(column, operator, value as TWhereClauseValue);
        return this
    }

    whereIn(column: string, values: TWhereClauseValue[]): IQueryBuilder<M> {
        this.builder.where(column, 'in', values);
        return this
    }

    whereNotIn(column: string, values: any[]): IQueryBuilder<M> {
        return this
    }

    whereNull(column: string): IQueryBuilder<M> {
        return this
    }

    whereNotNull(column: string): IQueryBuilder<M> {
        return this
    }

    whereBetween(column: string, range: [any, any]): IQueryBuilder<M> {
        return this 
    }

    whereNotBetween(column: string, range: [any, any]): IQueryBuilder<M> {
        return this
    }

    whereLike(column: string, value: TWhereClauseValue): IQueryBuilder<M> {
        return this
    }

    whereNotLike(column: string, value: TWhereClauseValue): IQueryBuilder<M> {
        return this
    }

    orderBy(column: string, direction: TDirection = 'asc'): IQueryBuilder<M> {
        this.builder.orderBy({ column, direction });
        return this
    }

    async get(): Promise<ModelCollection<M>> {
        return await captureError(async () => {
            const res = await this.executeExpression(this.builder)

            return collect<M>(
                this.formatQueryResult(res)
            )
        })
    }

}

export default PostgresQueryBuilder;