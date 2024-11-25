import { IModel } from "@src/core/interfaces/IModel";

import { ICollection } from "../../collections/interfaces/ICollection";
import { TDirection } from "./TEnums";

export type ModelCollection = ICollection<IModel>;

/* eslint-disable no-unused-vars */
export interface IQueryBuilder<TModel extends IModel = IModel> {

    // find methods
    find(id: unknown): TModel | null;
    findOrFail(id: unknown): TModel;
    
    // get methods
    all(): Promise<ModelCollection>;
    get(): Promise<ModelCollection>;
    first(): TModel | null;
    last(): TModel | null;

    // Select methods
    select(columns?: string | string[]): IQueryBuilder;
    selectRaw(expression: string, bindings?: any[]): IQueryBuilder;
    distinct(): IQueryBuilder;

    // Where clauses
    where(column: string, operator?: string, value?: any): IQueryBuilder;
    whereIn(column: string, values: any[]): IQueryBuilder;
    whereNotIn(column: string, values: any[]): IQueryBuilder;
    whereNull(column: string): IQueryBuilder;
    whereNotNull(column: string): IQueryBuilder;
    whereBetween(column: string, range: [any, any]): IQueryBuilder;
    whereRaw(query: string, bindings?: any[]): IQueryBuilder;

    // Joins
    join(table: string, first: string, operator?: string, second?: string): IQueryBuilder;
    leftJoin(table: string, first: string, operator?: string, second?: string): IQueryBuilder;
    rightJoin(table: string, first: string, operator?: string, second?: string): IQueryBuilder;
    crossJoin(table: string): IQueryBuilder;

    // Ordering
    orderBy(column: string, direction?: TDirection): IQueryBuilder;
    orderByDesc(column: string): IQueryBuilder;
    latest(column?: string): IQueryBuilder;
    oldest(column?: string): IQueryBuilder;

    // Grouping
    groupBy(...columns: string[]): IQueryBuilder;
    having(column: string, operator?: string, value?: any): IQueryBuilder;

    // Limiting
    limit(value: number): IQueryBuilder;
    offset(value: number): IQueryBuilder;
    skip(value: number): IQueryBuilder;
    take(value: number): IQueryBuilder;

    // Aggregates
    count(column?: string): Promise<number>;
    max(column: string): Promise<number>;
    min(column: string): Promise<number>;
    avg(column: string): Promise<number>;
    sum(column: string): Promise<number>;

    // Pagination
    paginate(perPage?: number, page?: number): Promise<{
        data: any[];
        total: number;
        currentPage: number;
        lastPage: number;
        perPage: number;
    }>;

    // Utility methods
    setBindings(bindings: any[]): IQueryBuilder;
    getBindings(): any[];

    // Cloning 
    clone(): IQueryBuilder;
}