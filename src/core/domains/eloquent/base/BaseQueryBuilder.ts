import { ICtor } from "@src/core/interfaces/ICtor";
import { IModel } from "@src/core/interfaces/IModel";
import IModelAttributes from "@src/core/interfaces/IModelData";

import { ICollection } from "../../collection/interfaces/ICollection";
import { IQueryBuilder } from "../interfaces/IQueryBuilder";
import { TDirection } from "../interfaces/TEnums";

export type TQueryBuilderOptions = {
    modelCtor: ICtor<IModel>;
}

class BaseQueryBuilder implements IQueryBuilder {

    /**
     * The constructor of the model associated with this query builder.
     */
    modelCtor!: ICtor<IModel>;

    /**
     * The connection name to use for the query builder
     */
    protected connectionName!: string;

    /**
     * Constructor
     * @param {Object} options The options for the query builder
     * @param {ICtor<IModel>} options.modelCtor The constructor of the model associated with this query builder
     */
    constructor({ modelCtor }: TQueryBuilderOptions) {
        this.setModelCtor(modelCtor);
        this.setConnectionName(new  modelCtor().connection);
    }

    /**
     * Retrieves the constructor of the model associated with this query builder.
     * @returns {ICtor<IModel>} The model constructor.
     */
    getModelCtor(): ICtor<IModel> {
        return this.modelCtor;
    }

    /**
     * Sets the model constructor to use for the query builder
     * @param {ICtor<IModel>} modelCtor The constructor of the model to use for the query builder
     */
    setModelCtor(modelCtor: ICtor<IModel>) {
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

    find(id: unknown): IModel<IModelAttributes> | null {
        throw new Error("Method not implemented.");
    }

    findOrFail(id: unknown): IModel<IModelAttributes> {
        throw new Error("Method not implemented.");
    }

    get(): Promise<ICollection<IModel<IModelAttributes>[]>> {
        throw new Error("Method not implemented.");
    }

    first(): IModel<IModelAttributes> | null {
        throw new Error("Method not implemented.");
    }

    last(): IModel<IModelAttributes> | null {
        throw new Error("Method not implemented.");
    }

    select(columns?: string | string[]): IQueryBuilder {
        throw new Error("Method not implemented.");
    }

    selectRaw(expression: string, bindings?: any[]): IQueryBuilder {
        throw new Error("Method not implemented.");
    }

    distinct(): IQueryBuilder {
        throw new Error("Method not implemented.");
    }

    where(column: string, operator?: string, value?: any): IQueryBuilder {
        throw new Error("Method not implemented.");
    }

    whereIn(column: string, values: any[]): IQueryBuilder {
        throw new Error("Method not implemented.");
    }

    whereNotIn(column: string, values: any[]): IQueryBuilder {
        throw new Error("Method not implemented.");
    }

    whereNull(column: string): IQueryBuilder {
        throw new Error("Method not implemented.");
    }

    whereNotNull(column: string): IQueryBuilder {
        throw new Error("Method not implemented.");
    }

    whereBetween(column: string, range: [any, any]): IQueryBuilder {
        throw new Error("Method not implemented.");
    }

    whereRaw(query: string, bindings?: any[]): IQueryBuilder {
        throw new Error("Method not implemented.");
    }

    join(table: string, first: string, operator?: string, second?: string): IQueryBuilder {
        throw new Error("Method not implemented.");
    }

    leftJoin(table: string, first: string, operator?: string, second?: string): IQueryBuilder {
        throw new Error("Method not implemented.");
    }

    rightJoin(table: string, first: string, operator?: string, second?: string): IQueryBuilder {
        throw new Error("Method not implemented.");
    }

    crossJoin(table: string): IQueryBuilder {
        throw new Error("Method not implemented.");
    }

    orderBy(column: string, direction?: TDirection): IQueryBuilder {
        throw new Error("Method not implemented.");
    }

    orderByDesc(column: string): IQueryBuilder {
        throw new Error("Method not implemented.");
    }

    latest(column?: string): IQueryBuilder {
        throw new Error("Method not implemented.");
    }

    oldest(column?: string): IQueryBuilder {
        throw new Error("Method not implemented.");
    }

    groupBy(...columns: string[]): IQueryBuilder {
        throw new Error("Method not implemented.");
    }

    having(column: string, operator?: string, value?: any): IQueryBuilder {
        throw new Error("Method not implemented.");
    }

    limit(value: number): IQueryBuilder {
        throw new Error("Method not implemented.");
    }

    offset(value: number): IQueryBuilder {
        throw new Error("Method not implemented.");
    }

    skip(value: number): IQueryBuilder {
        throw new Error("Method not implemented.");
    }

    take(value: number): IQueryBuilder {
        throw new Error("Method not implemented.");
    }

    count(column?: string): Promise<number> {
        throw new Error("Method not implemented.");
    }

    max(column: string): Promise<number> {
        throw new Error("Method not implemented.");
    }

    min(column: string): Promise<number> {
        throw new Error("Method not implemented.");
    }

    avg(column: string): Promise<number> {
        throw new Error("Method not implemented.");
    }

    sum(column: string): Promise<number> {
        throw new Error("Method not implemented.");
    }

    paginate(perPage?: number, page?: number): Promise<{ data: any[]; total: number; currentPage: number; lastPage: number; perPage: number; }> {
        throw new Error("Method not implemented.");
    }

    setBindings(bindings: any[]): IQueryBuilder {
        throw new Error("Method not implemented.");
    }

    getBindings(): any[] {
        throw new Error("Method not implemented.");
    }

    clone(): IQueryBuilder {
        throw new Error("Method not implemented.");
    }

}

export default BaseQueryBuilder