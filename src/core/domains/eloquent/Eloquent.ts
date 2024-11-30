import { ICtor } from "@src/core/interfaces/ICtor";
import { App } from "@src/core/services/App";

import Collection from "../collections/Collection";
import { IDatabaseAdapter } from "../database/interfaces/IDatabaseAdapter";
import BaseEloquent from "./base/BaseEloquent";
import MissingTableException from "./exceptions/MissingTableException";
import QueryBuilderException from "./exceptions/QueryBuilderException";
import { IEloquent, OperatorArray, TFormatterFn, TOperator, TWhereClauseValue } from "./interfaces/IEloquent";
import IEloquentExpression from "./interfaces/IEloquentExpression";
import { TDirection } from "./interfaces/TEnums";

export type TQueryBuilderOptions = {
    adapterName: string,
    connectionName: string;
    tableName?: string;
    formatterFn?: TFormatterFn;
    expressionCtor: ICtor<IEloquentExpression>;
}

abstract class Eloquent<Data = unknown, Adapter extends IDatabaseAdapter = IDatabaseAdapter> extends BaseEloquent implements IEloquent<Data> {

    /**
     * The connection name to use for the query builder
    */
    protected connectionName!: string;

    /**
     * The table name to use for the query builder
     */
    protected tableName?: string;
    
    /**
     * The columns to select from the database
     */
    protected columns: string[] = [];

    /**
     * The adapter name to use for the query builder (logging purposes)
     */
    protected adapterName!: string;

    /**
     * Formatter function to transform row result
     */
    protected formatterFn?: TFormatterFn;

    /**
     * Constructor
     * @param {Object} options The options for the query builder
     * @param {ICtor<Data>} options.modelCtor The constructor of the model associated with this query builder
     */
    constructor({ adapterName, connectionName, expressionCtor, tableName = undefined, formatterFn = undefined }: TQueryBuilderOptions) {
        super()

        // Required
        this.adapterName = adapterName
        this.setConnectionName(connectionName ?? App.container('db').getDefaultConnectionName())
        this.setExpressionCtor(expressionCtor);

        // Optional
        this.setTable(tableName)
        this.setFormatter(formatterFn)
    }

    /**
     * Resets the expression builder to its default state.
     * 
     * This method is a convenience wrapper around the expression builder's
     * `reset` method.
     * 
     * @returns {IEloquentExpression} The expression builder instance after resetting.
     */
    protected resetExpression(): IEloquent<Data> {
        this.expression = new this.expressionCtor().setTable(this.useTable())
        return this
    }

    /**
     * Sets the formatter function for the query builder. This function will be
     * called with each row of the result as an argument. The function should
     * return the transformed row.
     *
     * @param {TFomatterFn} formatterFn The formatter function to set
     * @returns {this} The query builder instance to enable chaining
     */
    protected setFormatter(formatterFn?: TFormatterFn): this {
        this.formatterFn = formatterFn
        return this
    }
    
    /**
     *
     * @param rows 
     * @returns 
     */
    protected formatQueryResults(rows: unknown[]): Data[] {
        return rows.map(row => {
            return this.formatterFn ? this.formatterFn(row) : row
        }) as Data[]
    }

    /**
     * Logs a message to the logger as an error with the query builder's
     * adapter name prefixed.
     * @param {string} message The message to log
     */
    protected log(message: string, ...args: any[]) {
        App.container('logger').error(`(QueryBuilder:${this.adapterName}): ${message}`, ...args);
    }

    /**
     * Sets the table name to use for the query builder.
     * 
     * This is a convenience method for {@link setTable}.
     * 
     * @param {string} tableName The table name to set.
     * @returns {this} The query builder instance for chaining.
     */
    table(tableName: string): IEloquent<Data> {
        this.expression.setTable(tableName);
        return this.setTable(tableName)
    }

    /**
     * Sets the table name to use for the query builder.
     * 
     * @param {string} tableName The table name to set.
     * @returns {this} The query builder instance.
     */
    setTable(tableName?: string): IEloquent<Data> {
        this.tableName = tableName

        if(this.tableName) {
            this.expression.setTable(this.tableName);    
        }
        
        return this
    }

    /**
     * Retrieves the table name associated with the query builder, or throws an
     * exception if it is not set.
     * 
     * @returns {string} The table name
     * @throws {MissingTableException} If the table name is not set
     */
    useTable(): string {
        if(!this.table) {
            throw new MissingTableException()
        }
        return this.tableName as string
    }

    /**
     * Retrieves the table name associated with the model for this query builder
     * @returns {string} The table name
     */
    protected getTable() {
        return this.tableName
    }

    /**
     * Sets the columns to select for the query builder.
     * @param {string[]} columns - The columns to set for selection.
     * @returns {IEloquent<Data>} The query builder instance.
     */
    protected setColumns(columns: string[]): IEloquent<Data> {
        this.expression.setColumns(columns);
        return this as unknown as IEloquent<Data>;
    }

    /**
     * Retrieves the database adapter for the connection name associated with this query builder.
     * @returns {IDatabaseAdapter} The database adapter.
     */
    protected getDatabaseAdapter(): Adapter {
        return App.container('db').getAdapter<Adapter>(this.getConnectionName())
    }

    /**
     * Retrieves the connection name associated with this query builder.
     * @returns {string} The connection name.
     */
    protected getConnectionName(): string {
        return this.connectionName
    }

    /**
     * Sets the connection name to use for the query builder
     * @param {string} connectionName The connection name to use
     */
    protected setConnectionName(connectionName: string) {
        this.connectionName = connectionName
    }

    /**
     * Sets the columns to select for the query builder.
     * @param {string|string[]} [columns='*'] The columns to set for selection.
     * @returns {IEloquent<Data>} The query builder instance.
     */
    select(columns?: string | string[]): IEloquent<Data> {

        if(columns === undefined) {
            this.columns = ['*'];
            return this as unknown as IEloquent<Data>;
        }

        if(typeof columns === 'string' && columns === '*') {
            this.columns = ['*'];
        }

        this.setColumns(Array.isArray(columns) ? columns : [columns])
        return this as unknown as IEloquent<Data>;
    }

    /**
     * Sets the distinct columns for the query builder
     * @param {string|string[]} columns The columns to set for distinct
     * @returns {IEloquent<Data>} The query builder instance
     */
    distinct(columns: string | string[]): IEloquent<Data> {
        columns = Array.isArray(columns) ? columns : [columns];
        this.expression.setDistinctColumns(columns);
        return this as unknown as IEloquent<Data>;
    }
    
    /**
     * Clones the query builder instance.
     *
     * The cloned instance will have the same model constructor associated with it.
     * @returns {IEloquent} The cloned query builder instance
     */
    clone(): IEloquent<Data> {
        return new (this.constructor as any)({
            adapterName: this.adapterName,
            tableName: this.tableName,
            connectionName: this.connectionName,
            formatterFn: this.formatterFn
        })
    }



    abstract execute<T>(builder: IEloquentExpression): Promise<T>;

    abstract find(id: string | number): Promise<Data | null>;

    abstract findOrFail(id: string | number): Promise<Data>;

    abstract get(): Promise<Collection<Data>>;

    abstract all(): Promise<Collection<Data>>;

    abstract first(): Promise<Data | null>;

    abstract last(): Promise<Data | null>;

    abstract insert(documents: object | object[]): Promise<Collection<Data>>

    /**
     * Adds a where clause to the query builder.
     *
     * This method allows for filtering the query results based on a specified
     * column and condition. It supports various operators for comparison.
     * If only the column and a single value are provided, it defaults to using
     * the '=' operator for comparison.
     *
     * @param {string} column - The column to apply the where condition on.
     * @param {TOperator} [operator] - The operator to use for comparison.
     * @param {TWhereClauseValue} [value] - The value to compare against.
     * @returns {IEloquent<Data>} The query builder instance for chaining.
     * @throws {QueryBuilderException} If an invalid or missing operator is provided.
     */
    where(column: string, operator?: TOperator, value?: TWhereClauseValue): IEloquent<Data> {

        // Handle default equals case
        if(value === undefined) {
            this.expression.where(column, '=', operator as TWhereClauseValue);
            return this
        }

        // Check operator has been provided and matches expected value
        if(operator === undefined || OperatorArray.includes(operator) === false) {
            throw new QueryBuilderException('Operator is required')
        }

        this.expression.where(column, operator, value);
        return this
    }

    /**
     * Adds a where in clause to the query builder.
     * 
     * @param {string} column - The column to apply the where in condition on.
     * @param {TWhereClauseValue[]} values - An array of values to compare against.
     * @returns {IEloquent<Data>} The query builder instance for chaining.
     */
    whereIn(column: string, values: TWhereClauseValue[]): IEloquent<Data> {
        this.expression.where(column, 'in', values);
        return this
    }

    /**
     * Adds a where not in clause to the query builder.
     * 
     * This method allows for filtering the query results by excluding rows
     * where the specified column's value is within the given array of values.
     * 
     * @param {string} column - The column to apply the where not in condition on.
     * @param {TWhereClauseValue[]} values - An array of values to exclude.
     * @returns {IEloquent<Data>} The query builder instance for chaining.
     */
    whereNotIn(column: string, values: any[]): IEloquent<Data> {
        this.expression.where(column, 'not in', values);
        return this
    }

    whereNull(column: string): IEloquent<Data> {
        this.expression.where(column, 'is null', null);
        return this
    }

    whereNotNull(column: string): IEloquent<Data> {
        this.expression.where(column, 'is not null', null);
        return this
    }

    whereBetween(column: string, range: [TWhereClauseValue, TWhereClauseValue]): IEloquent<Data> {
        this.expression.where(column, 'between', range);
        return this 
    }

    whereNotBetween(column: string, range: [any, any]): IEloquent<Data> {
        this.expression.where(column, 'not between', range);
        return this
    }

    whereLike(column: string, value: TWhereClauseValue): IEloquent<Data> {
        this.expression.where(column, 'like', value);
        return this
    }

    whereNotLike(column: string, value: TWhereClauseValue): IEloquent<Data> {
        this.expression.where(column, 'not like', value);
        return this
    }

    orderBy(column: string, direction: TDirection = 'asc'): IEloquent<Data> {
        this.expression.orderBy({ column, direction });
        return this
    }

    offset(offset: number): IEloquent<Data> {
        this.expression.setOffset(offset);
        return this
    }
    
    skip(skip: number): IEloquent<Data> {
        return this.offset(skip)
    }

    limit(limit: number): IEloquent<Data> {
        this.expression.setLimit(limit);
        return this        
    }

    take(take: number): IEloquent<Data> {
        return this.limit(take)
    }


    // abstract whereRaw(query: string, bindings?: any[]): Promise<IQueryBuilder>;

    // abstract join(table: string, first: string, operator?: string, second?: string): Promise<IQueryBuilder>;

    // abstract leftJoin(table: string, first: string, operator?: string, second?: string): Promise<IQueryBuilder>;

    // abstract rightJoin(table: string, first: string, operator?: string, second?: string): Promise<IQueryBuilder>;

    // abstract crossJoin(table: string): Promise<IQueryBuilder>;

    // abstract latest(column?: string): Promise<IQueryBuilder>;

    // abstract oldest(column?: string): Promise<IQueryBuilder>;

    // abstract groupBy(...columns: string[]): Promise<IQueryBuilder>;

    // abstract having(column: string, operator?: string, value?: any): Promise<IQueryBuilder>;

    // abstract limit(value: number): Promise<IQueryBuilder>;

    // abstract offset(value: number): Promise<IQueryBuilder>;

    // abstract skip(value: number): Promise<IQueryBuilder>;

    // abstract take(value: number): Promise<IQueryBuilder>;

    // abstract count(column?: string): Promise<number>;

    // abstract max(column: string): Promise<number>;

    // abstract min(column: string): Promise<number>;

    // abstract avg(column: string): Promise<number>;

    // abstract sum(column: string): Promise<number>;

    // abstract paginate(perPage?: number, page?: number): Promise<{
    //     data: any[];
    //     total: number;
    //     currentPage: number;
    //     lastPage: number;
    //     perPage: number;
    // }>;


}

export default Eloquent