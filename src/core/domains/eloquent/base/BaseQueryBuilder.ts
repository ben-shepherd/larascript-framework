import { ICtor } from "@src/core/interfaces/ICtor";
import { IModel } from "@src/core/interfaces/IModel";

import { ICollection } from "../../collections/interfaces/ICollection";
import { ExpressionBuilderConstructor, IQueryBuilder } from "../interfaces/IQueryBuilder";
import { TDirection } from "../interfaces/TEnums";
import { App } from "@src/core/services/App";
import { IDatabaseAdapter } from "../../database/interfaces/IDatabaseAdapter";

export type TQueryBuilderOptions<M extends IModel = IModel> = {
    adapterName: string,
    modelCtor: ICtor<M>;
    expressionBuilderCtor: ICtor<ExpressionBuilderConstructor>
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
     * The bindings to use for the query builder
     */
    protected bindings: unknown[] = [];

    /**
     * The adapter name to use for the query builder (logging purposes)
     */
    protected adapterName!: string;

    /**
     * The constructor of the expression builder associated with this query builder
     */
    protected expressionBuilderCtor: ExpressionBuilderConstructor;

    /**
     * Constructor
     * @param {Object} options The options for the query builder
     * @param {ICtor<M>} options.modelCtor The constructor of the model associated with this query builder
     */
    constructor({ 
        adapterName,
        modelCtor,
        expressionBuilderCtor
    }: TQueryBuilderOptions<M>) {
        this.adapterName = adapterName
        this.expressionBuilderCtor = expressionBuilderCtor
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
     * Executes the provided async callback function and captures any errors
     * that occur during its execution. Logs any errors with the query builder's 
     * adapter name, error message, and stack trace, then rethrows the error.
     * 
     * @template T - The return type of the callback function.
     * @param {() => Promise<T>} callback - The async function to execute.
     * @returns {Promise<T>} - The result of the callback function, if successful.
     * @throws Will throw an error if the callback function fails.
     */
    protected async captureError<T>(callback:  () => Promise<T>): Promise<T> {
        try {
            return await callback()
        }
        catch (err) {
            if(err instanceof Error && err?.message) {
                App.container('logger').error(`): `, err.message, err.stack)
            }
            throw err
        }
    }

    abstract getExpressionBuilder(): ExpressionBuilderConstructor

    /**
     * Retrieves the database adapter for the connection name associated with this query builder.
     * @returns {IDatabaseAdapter} The database adapter.
     */
    protected getDatabaseAdapter(): Adapter {
        return App.container('db').getAdapter(this.getConnectionName()) as Adapter
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
     * Sets the bindings for the query builder.
     * @param {any[]} bindings The bindings to use for the query builder
     * @returns {this} The query builder instance
     */
    setBindings(bindings: any[]): this {
        this.bindings = bindings;
        return this
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
     clone(): IQueryBuilder {
        return new (this.constructor as any)({
            modelCtor:
            this.getModelCtor()
        })
     }

    abstract find(id: unknown): M | null;

    abstract findOrFail(id: unknown): M;

    abstract get(): Promise<ICollection<M>>;

    abstract all(): Promise<ICollection<M>>;

    abstract first(): M | null;

    abstract last(): M | null;

    abstract select(columns?: string | string[]): IQueryBuilder;

    abstract selectRaw(expression: string, bindings?: any[]): IQueryBuilder;

    abstract distinct(): IQueryBuilder;

    abstract where(column: string, operator?: string, value?: any): IQueryBuilder;

    abstract whereIn(column: string, values: any[]): IQueryBuilder;

    abstract whereNotIn(column: string, values: any[]): IQueryBuilder;

    abstract whereNull(column: string): IQueryBuilder;

    abstract whereNotNull(column: string): IQueryBuilder;

    abstract whereBetween(column: string, range: [any, any]): IQueryBuilder;

    abstract whereRaw(query: string, bindings?: any[]): IQueryBuilder;

    abstract join(table: string, first: string, operator?: string, second?: string): IQueryBuilder;

    abstract leftJoin(table: string, first: string, operator?: string, second?: string): IQueryBuilder;

    abstract rightJoin(table: string, first: string, operator?: string, second?: string): IQueryBuilder;

    abstract crossJoin(table: string): IQueryBuilder;

    abstract orderBy(column: string, direction?: TDirection): IQueryBuilder;

    abstract orderByDesc(column: string): IQueryBuilder;

    abstract latest(column?: string): IQueryBuilder;

    abstract oldest(column?: string): IQueryBuilder;

    abstract groupBy(...columns: string[]): IQueryBuilder;

    abstract having(column: string, operator?: string, value?: any): IQueryBuilder;

    abstract limit(value: number): IQueryBuilder;

    abstract offset(value: number): IQueryBuilder;

    abstract skip(value: number): IQueryBuilder;

    abstract take(value: number): IQueryBuilder;

    abstract count(column?: string): Promise<number>;

    abstract max(column: string): Promise<number>;

    abstract min(column: string): Promise<number>;

    abstract avg(column: string): Promise<number>;

    abstract sum(column: string): Promise<number>;

    abstract paginate(perPage?: number, page?: number): Promise<{ data: any[]; total: number; currentPage: number; lastPage: number; perPage: number; }>;


}

export default BaseQueryBuilder