import { ICtor } from "@src/core/interfaces/ICtor";
import { IModel } from "@src/core/interfaces/IModel";

import { ICollection } from "../../collections/interfaces/ICollection";

export type ModelCollection<T extends IModel = IModel> = ICollection<T>;
export type ExpressionBuilderConstructor<T = unknown>  = ICtor<T>;


export type TColumns = string[]

export type TOperator = "=" | "!=" | "<>" | ">" | "<" | ">=" | "<=" | "like" | "not like" | "in" | "not in" | "is null" | "is not null" | "between" | "not between"; 

export const OperatorArray = ["=", "!=", "<>", ">", "<", ">=", "<=", "like", "not like", "in", "not in", "is null", "is not null", "between", "not between"]

export type TWhereClauseValue = string | number | boolean | null 

export type TLogicalOperator = "and" | "or"

export type TWhereClause = {
    column: string,
    operator: TOperator,
    value: TWhereClauseValue | TWhereClauseValue[],
    logicalOperator?: TLogicalOperator
}

export type TJoin = {
    table: string,
    tableAbbreviation?: string,
    type: "inner" | "left" | "right" | "full" | "cross",
    leftColumn: string,
    rightColumn: string
}

export type TDirection = "asc" | "desc"

export type TOrderBy = {
    column: string,
    direction: TDirection
}

export type TOffset = {
    limit: number,
    offset?: number
}

/* eslint-disable no-unused-vars */
export interface IQueryBuilder<M extends IModel = IModel> {

    // selection
    select(columns?: string | string[]): IQueryBuilder<M>;

    // find methods
    find(id: string | number): Promise<M | null>;
    findOrFail(id: string | number): Promise<M>;
    
    // get methods
    // all(): Promise<ModelCollection<TModel>>;
    get(): Promise<ModelCollection<M>>;
    // first(): Promise<TModel | null>;
    // last(): Promise<TModel | null>;

    // // Select methods
    // select(columns?: string | string[]): Promise<IQueryBuilder>;
    // selectRaw(expression: string, bindings?: any[]): Promise<IQueryBuilder>;
    // distinct(): Promise<IQueryBuilder>;

    // // Where clauses
    where(column: string, value?: TWhereClauseValue): IQueryBuilder<M>;
    where(column: string, operator?: TOperator, value?: any): IQueryBuilder<M>;
    whereIn(column: string, values: TWhereClauseValue[]): IQueryBuilder<M>;
    whereNotIn(column: string, values: TWhereClauseValue[]): IQueryBuilder<M>;
    whereLike(column: string, value: TWhereClauseValue): IQueryBuilder<M>;
    whereNotLike(column: string, value: TWhereClauseValue): IQueryBuilder<M>;
    whereNull(column: string): IQueryBuilder<M>;
    whereNotNull(column: string): IQueryBuilder<M>;
    whereBetween(column: string, range: [TWhereClauseValue, TWhereClauseValue]): IQueryBuilder<M>;
    // whereRaw(query: string, bindings?: any[]): Promise<IQueryBuilder>;

    // // Joins
    // join(table: string, first: string, operator?: string, second?: string): Promise<IQueryBuilder>;
    // leftJoin(table: string, first: string, operator?: string, second?: string): Promise<IQueryBuilder>;
    // rightJoin(table: string, first: string, operator?: string, second?: string): Promise<IQueryBuilder>;
    // crossJoin(table: string): Promise<IQueryBuilder>;

    // // Ordering
    orderBy(column: string, direction?: TDirection): IQueryBuilder<M>;
    // latest(column?: string): Promise<IQueryBuilder>;
    // oldest(column?: string): Promise<IQueryBuilder>;

    // // Grouping
    // groupBy(...columns: string[]): Promise<IQueryBuilder>;
    // having(column: string, operator?: string, value?: any): Promise<IQueryBuilder>;

    // // Limiting
    // limit(value: number): Promise<IQueryBuilder>;
    // offset(value: number): Promise<IQueryBuilder>;
    // skip(value: number): Promise<IQueryBuilder>;
    // take(value: number): Promise<IQueryBuilder>;

    // // Aggregates
    // count(column?: string): Promise<number>;
    // max(column: string): Promise<number>;
    // min(column: string): Promise<number>;
    // avg(column: string): Promise<number>;
    // sum(column: string): Promise<number>;

    // // Pagination
    // paginate(perPage?: number, page?: number): Promise<{
    //     data: any[];
    //     total: number;
    //     currentPage: number;
    //     lastPage: number;
    //     perPage: number;
    // }>;

    // Utility methods
    setBindings(bindings: unknown[]): IQueryBuilder<M>;
    getBindings(): unknown[];

    // Cloning 
    clone(): IQueryBuilder<M>;
}