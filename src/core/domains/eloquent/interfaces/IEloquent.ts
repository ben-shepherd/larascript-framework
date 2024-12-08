/* eslint-disable no-unused-vars */


import { ICtor } from "@src/core/interfaces/ICtor";
import { IModel } from "@src/core/interfaces/IModel";
import IModelAttributes from "@src/core/interfaces/IModelData";

import Collection from "../../collections/Collection";
import IEloquentExpression from "./IEloquentExpression";

export type TColumns = string[]

export type TColumn = {
    column: string;
    tableName?: string;
    isFormatted?: boolean
    as?: string;
}

export type TOperator = "=" | "!=" | "<>" | ">" | "<" | ">=" | "<=" | "like" | "not like" | "in" | "not in" | "is null" | "is not null" | "between" | "not between"; 

export const OperatorArray = ["=", "!=", "<>", ">", "<", ">=", "<=", "like", "not like", "in", "not in", "is null", "is not null", "between", "not between"] as const

export type TWhereClauseValue = string | number | boolean | null | Date

export const LogicalOperators = {
    AND: "and",
    OR: "or"
} as const;

export type TLogicalOperator = typeof LogicalOperators[keyof typeof LogicalOperators];

export type TWhereClause = {
    column: string;
    tableName?: string;
    operator: TOperator;
    value: TWhereClauseValue | TWhereClauseValue[];
    logicalOperator?: TLogicalOperator;
}

export type TJoin = {
    type: typeof JoinTypes[keyof typeof JoinTypes],
    localTable?: string,
    localTableAbbreviation?: string,
    relatedTable?: string,
    relatedTableAbbreviation?: string,
    localColumn?: string,
    relatedColumn?: string
}

export const JoinTypes = {
    INNER: "inner",
    LEFT: "left",
    RIGHT: "right",
    FULL: "full",
    CROSS: "cross"
} as const;

export type TWith = {
    modelCtor: ICtor<IModel>,
    relationship: string
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

export interface IRelationship {
    _relationshipInterface: true;
    getLocalModelCtor(): ICtor<IModel>;
    getForeignModelCtor(): ICtor<IModel>;
    getForeignTableName(): string;
    getOptions(): IBelongsToOptions
    getLocalKey(): string;
    getForeignKey(): string;
}

export interface IBelongsToOptions {
    localKey: keyof IModelAttributes;
    foreignKey?: keyof IModelAttributes;
    foreignTable: string;
    filters?: object;
}

export type TFormatterFn = (row: unknown) => unknown;

export type QueryOptions = {
    connectionName: string;
    tableName?: string,
}

export type SetModelColumnsOptions = {
    columnPrefix?: string;
    targetProperty?: string;
    [key: string]: unknown;
}

export interface IEloquent<Model extends IModel = IModel, Attributes extends Model['attributes'] = Model['attributes'], Expression extends IEloquentExpression = IEloquentExpression> {
    
    // eloquent methods
    setConnectionName(connectionName: string): IEloquent<Model, Attributes>;
    getExpression(): Expression;
    setExpressionCtor(builderCtor: ICtor<Expression>): IEloquent<Model, Attributes>
    setExpression(expression: Expression): IEloquent<Model, Attributes>;
    cloneExpression(): IEloquentExpression;
    resetExpression(): IEloquent<Model, Attributes>;
    setModelCtor(modelCtor?: ICtor<IModel>): IEloquent<Model, Attributes>;
    getModelCtor(): ICtor<IModel> | undefined;
    setModelColumns(modelCtor?: ICtor<IModel>, options?: SetModelColumnsOptions): IEloquent<Model, Attributes>;

    // formatting
    // asModel<Model extends IModel>(): IEloquent<Model, Model>; 
    setFormatter(formatterFn?: TFormatterFn): IEloquent<Model, Attributes>;
    
    // execution
    execute<T = Attributes>(builder: IEloquentExpression): Promise<T>
    raw<T = unknown>(expression: string, bindings?: unknown[]): Promise<T>;

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
    setTable(table: string): IEloquent<Model, Attributes>;
    useTable(): string;

    // Creating and saving
    insert(documents: object | object[]): Promise<Collection<Attributes>>; 
    update(documents: object | object[]): Promise<Collection<Attributes>>;
    updateAll(documents: object | object[]): Promise<Collection<Attributes>>;
    // delete(data: Data): Promise<IEloquent<Model, Attributes>>;

    // selection
    select(columns?: string | string[]): IEloquent<Model, Attributes>;
    column(column: TColumn): IEloquent<Model, Attributes>;

    // find methods
    find(id: string | number): Promise<Attributes | null>;
    findOrFail(id: string | number): Promise<Attributes>;
    
    // get methods
    all(): Promise<Collection<Attributes>>;
    get(): Promise<Collection<Attributes>>;
    first(): Promise<Attributes | null>;
    firstOrFail(): Promise<Attributes>
    last(): Promise<Attributes | null>;
    lastOrFail(): Promise<Attributes>

    // Select methods
    select(columns?: string | string[]): IEloquent<Model, Attributes>;
    selectRaw(expression: string, bindings?: unknown[]): IEloquent<Model, Attributes>;
    distinct(columns: string | string[]): IEloquent<Model, Attributes>;

    // Where methods
    where(column: string, value?: TWhereClauseValue): IEloquent<Model, Attributes>;
    where(column: string, operator?: TOperator, value?: TWhereClauseValue, logicalOperator?: TLogicalOperator): IEloquent<Model, Attributes>;
    whereRaw<Q = unknown, Bindings = unknown>(query: Q, bindings?: Bindings): IEloquent<Model, Attributes>;

    orWhere(column: string, value?: TWhereClauseValue): IEloquent<Model, Attributes>;
    orWhere(column: string, operator?: TOperator, value?: TWhereClauseValue): IEloquent<Model, Attributes>;

    whereIn(column: string, values: TWhereClauseValue[]): IEloquent<Model, Attributes>;
    whereNotIn(column: string, values: TWhereClauseValue[]): IEloquent<Model, Attributes>;

    whereLike(column: string, value: TWhereClauseValue): IEloquent<Model, Attributes>;
    whereNotLike(column: string, value: TWhereClauseValue): IEloquent<Model, Attributes>;

    whereNull(column: string): IEloquent<Model, Attributes>;
    whereNotNull(column: string): IEloquent<Model, Attributes>;

    whereBetween(column: string, range: [TWhereClauseValue, TWhereClauseValue]): IEloquent<Model, Attributes>;
    whereNotBetween(column: string, range: [TWhereClauseValue, TWhereClauseValue]): IEloquent<Model, Attributes>;

    // Joins
    join(relatedTable: string, localColumn: string, relatedColumn: string): IEloquent<Model, Attributes>;
    fullJoin(relatedTable: string, localColumn: string, relatedColumn: string): IEloquent<Model, Attributes>;
    leftJoin(relatedTable: string, localColumn: string, relatedColumn: string): IEloquent<Model, Attributes>;
    rightJoin(relatedTable: string, localColumn: string, relatedColumn: string): IEloquent<Model, Attributes>;
    crossJoin(table: string): IEloquent<Model, Attributes>;
    with(relationship: string): IEloquent<Model, Attributes>;

    // Ordering
    orderBy(column: string, direction?: TDirection): IEloquent<Model, Attributes>;
    latest(column?: string): IEloquent<Model, Attributes>;
    newest(column?: string): IEloquent<Model, Attributes>;
    oldest(column?: string): IEloquent<Model, Attributes>;

    // Grouping
    // groupBy(...columns: string[]): Promise<IQueryB   uilder>;
    // having(column: string, operator?: string, value?: any): Promise<IQueryBuilder>;

    // Limiting
    limit(limit: number): IEloquent<Model, Attributes>;
    offset(offset: number): IEloquent<Model, Attributes>;
    skip(skip: number): IEloquent<Model, Attributes>;
    take(take: number): IEloquent<Model, Attributes>;

    // Aggregates
    // count(column?: string): Promise<number>;
    // max(column: string): Promise<number>;
    // min(column: string): Promise<number>;
    // avg(column: string): Promise<number>;
    // sum(column: string): Promise<number>;

    // Pagination
    // paginate(perPage?: number, page?: number): Promise<{
    //     data: any[];
    //     total: number;
    //     currentPage: number;
    //     lastPage: number;
    //     perPage: number;
    // }>;

    // Cloning 
    clone<T = Attributes>(): IEloquent<Model, Attributes>;
}