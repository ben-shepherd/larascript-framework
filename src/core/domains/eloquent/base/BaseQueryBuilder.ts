import { ICtor } from "@src/core/interfaces/ICtor";
import { IModel } from "@src/core/interfaces/IModel";
import { App } from "@src/core/services/App";

import { IDatabaseAdapter } from "../../database/interfaces/IDatabaseAdapter";
import { IQueryBuilder, ModelCollection, TWhereClauseValue } from "../interfaces/IQueryBuilder";
import { TDirection } from "../interfaces/TEnums";

export type TQueryBuilderOptions<M extends IModel = IModel> = {
    adapterName: string,
    modelCtor: ICtor<M>
}

abstract class BaseQueryBuilder<M extends IModel, Adapter extends IDatabaseAdapter = IDatabaseAdapter> implements IQueryBuilder<M> {

    /**
     * The constructor of the model associated with this query builder.
     */
    modelCtor!: ICtor<M>;

    /**
     * The connection name to use for the query builder
     */
    protected connectionName!: string;

    /**
     * The columns to select from the database
     */
    protected columns: string[] = [];

    /**
     * The bindings to use for the query builder
     */
    protected bindings: unknown[] = [];

    /**
     * The adapter name to use for the query builder (logging purposes)
     */
    protected adapterName!: string;

    /**
     * Constructor
     * @param {Object} options The options for the query builder
     * @param {ICtor<M>} options.modelCtor The constructor of the model associated with this query builder
     */
    constructor({ adapterName, modelCtor }: TQueryBuilderOptions<M>) {
        this.adapterName = adapterName
        this.setModelCtor(modelCtor);
        this.setConnectionName(new  modelCtor().connection);
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
     * Retrieves the table name associated with the model for this query builder
     * @returns {string} The table name
     */
    protected getTable() {
        return new this.modelCtor().table;
    }

    /**
     * Sets the columns to select for the query builder.
     * @param {string[]} columns - The columns to set for selection.
     * @returns {IQueryBuilder<M>} The query builder instance.
     */
    protected setColumns(columns: string[]): IQueryBuilder<M> {
        this.columns = columns;
        return this as unknown as IQueryBuilder<M>;
    }

    /**
     * Retrieves the columns set for this query builder.
     * @returns {string[]} The columns set for this query builder.
     */
    protected getColumns(): string[] {
        return this.columns;
    }

    /**
     * Retrieves the database adapter for the connection name associated with this query builder.
     * @returns {IDatabaseAdapter} The database adapter.
     */
    protected getDatabaseAdapter(): Adapter {
        return App.container('db').getAdapter<Adapter>(this.getConnectionName())
    }

    /**
     * Retrieves the constructor of the model associated with this query builder.
     * @returns {ICtor<M>} The model constructor.
     */
    protected getModelCtor(): ICtor<M> {
        return this.modelCtor;
    }

    /**
     * Sets the model constructor to use for the query builder
     * @param {ICtor<M>} modelCtor The constructor of the model to use for the query builder
     */
    protected setModelCtor(modelCtor: ICtor<M>) {
        this.modelCtor = modelCtor;
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
     * Creates a new instance of the model using the provided data.
     *
     * @param {unknown} data The data to initialize the model with.
     * @returns {M} A new instance of the model.
     */
    protected createModel(data: unknown): M {
        return new this.modelCtor(data)
    }

    /**
     * Sets the columns to select for the query builder.
     * @param {string|string[]} [columns='*'] The columns to set for selection.
     * @returns {IQueryBuilder<M>} The query builder instance.
     */
    select(columns?: string | string[]): IQueryBuilder<M> {

        if(columns === undefined) {
            this.columns = ['*'];
            return this as unknown as IQueryBuilder<M>;
        }

        if(typeof columns === 'string' && columns === '*') {
            this.columns = ['*'];
        }

        this.setColumns(Array.isArray(columns) ? columns : [columns])
        return this as unknown as IQueryBuilder<M>;
    }
    
    /**
     * Sets the bindings for the query builder.
     * @param {any[]} bindings The bindings to use for the query builder
     * @returns {this} The query builder instance
     */
    setBindings(bindings: any[]): IQueryBuilder<M> {
        this.bindings = bindings;
        return this as unknown as IQueryBuilder<M>;
    }

    /**
     * Retrieves the bindings associated with this query builder.
     * @returns {unknown[]} The bindings associated with this query builder.
     */
    getBindings(): unknown[] {
        return this.bindings
    }

    /**
     * Clones the query builder instance.
     *
     * The cloned instance will have the same model constructor associated with it.
     * @returns {IQueryBuilder} The cloned query builder instance
     */
    clone(): IQueryBuilder<M> {
        return new (this.constructor as any)({
            modelCtor:
            this.getModelCtor()
        })
    }

    abstract find(id: string | number): Promise<M | null>;

    abstract findOrFail(id: string | number): Promise<M>;

    abstract get(): Promise<ModelCollection<M>>;

    // abstract all(): Promise<ModelCollection<M>>;

    // abstract first(): Promise<M | null>;

    // abstract last(): Promise<M | null>;

    // abstract select(columns?: string | string[]): Promise<IQueryBuilder>;

    // abstract selectRaw(expression: string, bindings?: any[]): Promise<IQueryBuilder>;

    // abstract distinct(): Promise<IQueryBuilder>;

    abstract where(column: string, operator?: string, value?: any): IQueryBuilder<M>;

    abstract whereIn(column: string, values: any[]): IQueryBuilder<M>;

    abstract whereNotNull(column: string): IQueryBuilder<M>;

    abstract whereNull(column: string): IQueryBuilder<M>;

    abstract whereBetween(column: string, range: [any, any]): IQueryBuilder<M>;

    abstract whereNotIn(column: string, values: any[]): IQueryBuilder<M>;

    abstract whereLike(column: string, value: TWhereClauseValue): IQueryBuilder<M>;

    abstract whereNotLike(column: string, value: TWhereClauseValue): IQueryBuilder<M>;

    // abstract whereRaw(query: string, bindings?: any[]): Promise<IQueryBuilder>;

    // abstract join(table: string, first: string, operator?: string, second?: string): Promise<IQueryBuilder>;

    // abstract leftJoin(table: string, first: string, operator?: string, second?: string): Promise<IQueryBuilder>;

    // abstract rightJoin(table: string, first: string, operator?: string, second?: string): Promise<IQueryBuilder>;

    // abstract crossJoin(table: string): Promise<IQueryBuilder>;

    abstract orderBy(column: string, direction?: TDirection): IQueryBuilder<M>;

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

export default BaseQueryBuilder