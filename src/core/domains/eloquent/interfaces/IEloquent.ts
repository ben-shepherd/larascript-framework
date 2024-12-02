/* eslint-disable no-unused-vars */


import { ICtor } from "@src/core/interfaces/ICtor";
import { QueryResult } from "pg";

import Collection from "../../collections/Collection";
import IEloquentExpression from "./IEloquentExpression";

export type TColumns = string[]

export type TOperator = "=" | "!=" | "<>" | ">" | "<" | ">=" | "<=" | "like" | "not like" | "in" | "not in" | "is null" | "is not null" | "between" | "not between"; 

export const OperatorArray = ["=", "!=", "<>", ">", "<", ">=", "<=", "like", "not like", "in", "not in", "is null", "is not null", "between", "not between"] as const

export type TWhereClauseValue = string | number | boolean | null | Date

export const LogicalOperators = {
    AND: "and",
    OR: "or"
} as const;

export type TLogicalOperator = typeof LogicalOperators[keyof typeof LogicalOperators];

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

export type TOffsetLimit = {
    limit?: number,
    offset?: number
}

export type TFormatterFn = (row: unknown) => unknown;

export interface IEloquent<Data = unknown, Expression extends IEloquentExpression = IEloquentExpression> {
    
    // eloquent methods
    setConnectionName(connectionName: string): IEloquent<Data>;
    setFormatter(formatterFn?: TFormatterFn): IEloquent<Data>;
    getExpression(): Expression;
    setExpressionCtor(builderCtor: ICtor<Expression>): IEloquent<Data>
    resetExpression(): IEloquent<Data>;

    // execution
    execute<T = Data>(builder: IEloquentExpression): Promise<T>
    raw<T = QueryResult>(expression: string, bindings?: unknown[]): Promise<T>;

    // db methods
    createDatabase(name: string): Promise<void>;
    databaseExists(name: string): Promise<boolean>;
    dropDatabase(name: string): Promise<void>;

    // table methods
    createTable(name: string, ...args: any[]): Promise<void>;
    dropTable(name: string, ...args: any[]): Promise<void>;
    tableExists(name: string): Promise<boolean>;
    alterTable(name: string, ...args: any[]): Promise<void>
    dropAllTables(): Promise<void>;

    // table methods
    setTable(table: string): IEloquent<Data>;
    useTable(): string;

    // Creating and saving
    insert(documents: object | object[]): Promise<Collection<Data>>; // Promise<IEloquent<Data>): Promise<IEloquent<Data>>;
    update(documents: object | object[]): Promise<Collection<Data>>;
    updateAll(documents: object | object[]): Promise<Collection<Data>>;
    // delete(data: Data): Promise<IEloquent<Data>>;

    // selection
    select(columns?: string | string[]): IEloquent<Data>;

    // find methods
    find(id: string | number): Promise<Data | null>;
    findOrFail(id: string | number): Promise<Data>;
    
    // get methods
    all(): Promise<Collection<Data>>;
    get(): Promise<Collection<Data>>;
    first(): Promise<Data | null>;
    firstOrFail(): Promise<Data>
    last(): Promise<Data | null>;
    lastOrFail(): Promise<Data>

    // Select methods
    select(columns?: string | string[]): IEloquent<Data>;
    selectRaw(expression: string, bindings?: unknown[]): IEloquent<Data>;
    distinct(columns: string | string[]): IEloquent<Data>;

    // Where methods
    where(column: string, value?: TWhereClauseValue): IEloquent<Data>;
    where(column: string, operator?: TOperator, value?: TWhereClauseValue, logicalOperator?: TLogicalOperator): IEloquent<Data>;
    whereRaw<Q = unknown, Bindings = unknown>(query: Q, bindings?: Bindings): IEloquent<Data>;

    orWhere(column: string, value?: TWhereClauseValue): IEloquent<Data>;
    orWhere(column: string, operator?: TOperator, value?: TWhereClauseValue): IEloquent<Data>;

    whereIn(column: string, values: TWhereClauseValue[]): IEloquent<Data>;
    whereNotIn(column: string, values: TWhereClauseValue[]): IEloquent<Data>;

    whereLike(column: string, value: TWhereClauseValue): IEloquent<Data>;
    whereNotLike(column: string, value: TWhereClauseValue): IEloquent<Data>;

    whereNull(column: string): IEloquent<Data>;
    whereNotNull(column: string): IEloquent<Data>;

    whereBetween(column: string, range: [TWhereClauseValue, TWhereClauseValue]): IEloquent<Data>;
    // whereNotBetween(column: string, range: [TWhereClauseValue, TWhereClauseValue]): IEloquent<Data>;

    // whereRaw(query: string, bindings?: any[]): Promise<IQueryBuilder>;

    // // Joins
    // join(table: string, first: string, operator?: string, second?: string): Promise<IQueryBuilder>;
    // leftJoin(table: string, first: string, operator?: string, second?: string): Promise<IQueryBuilder>;
    // rightJoin(table: string, first: string, operator?: string, second?: string): Promise<IQueryBuilder>;
    // crossJoin(table: string): Promise<IQueryBuilder>;

    // // Ordering
    orderBy(column: string, direction?: TDirection): IEloquent<Data>;
    // latest(column?: string): Promise<IQueryBuilder>;
    // oldest(column?: string): Promise<IQueryBuilder>;

    // // Grouping
    // groupBy(...columns: string[]): Promise<IQueryBuilder>;
    // having(column: string, operator?: string, value?: any): Promise<IQueryBuilder>;

    // // Limiting
    limit(limit: number): IEloquent<Data>;
    offset(offset: number): IEloquent<Data>;
    skip(skip: number): IEloquent<Data>;
    take(take: number): IEloquent<Data>;

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

    // Cloning 
    clone(): IEloquent<Data>;
}