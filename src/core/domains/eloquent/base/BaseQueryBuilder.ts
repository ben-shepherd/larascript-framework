import { ICtor } from "@src/core/interfaces/ICtor";
import { IModel } from "@src/core/interfaces/IModel";

import { ICollection } from "../../collections/interfaces/ICollection";
import { IQueryBuilder } from "../interfaces/IQueryBuilder";
import { TDirection } from "../interfaces/TEnums";

export type TQueryBuilderOptions = {
    modelCtor: ICtor<IModel>;
}

abstract class BaseQueryBuilder<M extends IModel> implements IQueryBuilder<M> {

    /**
     * The constructor of the model associated with this query builder.
     */
    modelCtor!: ICtor<M>;

    /**
     * The connection name to use for the query builder
     */
    protected connectionName!: string;

    /**
     * Constructor
     * @param {Object} options The options for the query builder
     * @param {ICtor<M>} options.modelCtor The constructor of the model associated with this query builder
     */
    constructor({ modelCtor }: TQueryBuilderOptions) {
        this.setModelCtor(modelCtor);
        this.setConnectionName(new  modelCtor().connection);
    }

    /**
     * Retrieves the constructor of the model associated with this query builder.
     * @returns {ICtor<M>} The model constructor.
     */
    getModelCtor(): ICtor<M> {
        return this.modelCtor;
    }

    /**
     * Sets the model constructor to use for the query builder
     * @param {ICtor<M>} modelCtor The constructor of the model to use for the query builder
     */
    setModelCtor(modelCtor: ICtor<M>) {
        this.modelCtor = modelCtor;
    }

    /**
     * Retrieves the connection name associated with this query builder.
     * @returns {string} The connection name.
     */
    getConnectionName(): string {
        return this.connectionName
    }

    /**
     * Sets the connection name to use for the query builder
     * @param {string} connectionName The connection name to use
     */
    setConnectionName(connectionName: string) {
        this.connectionName = connectionName
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

    abstract setBindings(bindings: any[]): IQueryBuilder;

    abstract getBindings(): any[];

    abstract clone(): IQueryBuilder;

}

export default BaseQueryBuilder