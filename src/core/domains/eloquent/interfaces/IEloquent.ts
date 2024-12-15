/* eslint-disable no-unused-vars */


import Collection from "@src/core/domains/collections/Collection";
import IEloquentExpression from "@src/core/domains/eloquent/interfaces/IEloquentExpression";
import { ICtor } from "@src/core/interfaces/ICtor";
import { IModel, ModelConstructor } from "@src/core/interfaces/IModel";
import IModelAttributes from "@src/core/interfaces/IModelData";

export type TColumnOption = {
    column: string | null;
    tableName?: string;
    preFormattedColumn?: boolean
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

export type TGroupBy = {
    column: string;
    tableName?: string
}

export interface IRelationship {
    _relationshipInterface: boolean;
    getLocalModelCtor(): ModelConstructor<IModel>;
    getForeignModelCtor(): ModelConstructor<IModel>;
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

export type IdGeneratorFn<T = unknown> = <ReturnType = T>(...args: any[]) => ReturnType;

export type TransactionFn<Model extends IModel = IModel> = (query: IEloquent<Model>) => Promise<void>;

export interface IEloquent<Model extends IModel = IModel> {
    
    // eloquent methods
    setConnectionName(connectionName: string): IEloquent<Model>;
    getExpression(): IEloquentExpression;
    setExpressionCtor(builderCtor: ICtor<IEloquentExpression>): IEloquent<Model>
    setExpression(expression: IEloquentExpression): IEloquent<Model>;
    cloneExpression(): IEloquentExpression;
    resetExpression(): IEloquent<Model>;
    setModelCtor(modelCtor?: ICtor<IModel>): IEloquent<Model>;
    getModelCtor(): ICtor<IModel> | undefined;
    setModelColumns(modelCtor?: ICtor<IModel>, options?: SetModelColumnsOptions): IEloquent<Model>;

    // id generator
    setIdGenerator(idGeneratorFn?: IdGeneratorFn): IEloquent<Model>;
    getIdGenerator(): IdGeneratorFn | undefined;
    generateId<T = unknown>(): T | null;

    // results
    fetchRows<T = unknown>(expression: IEloquentExpression, ...args: any[]): Promise<T>;

    // formatting
    // asModel<Model extends IModel>(): IEloquent<Model, Model>; 
    setFormatter(formatterFn?: TFormatterFn): IEloquent<Model>;
    
    // execution
    execute<T = Model['attributes']>(builder: IEloquentExpression): Promise<T>
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
    setTable(table: string): IEloquent<Model>;
    useTable(): string;

    // Creating and saving-
    insert(documents: object | object[]): Promise<Collection<Model>>; 
    update(documents: object | object[]): Promise<Collection<Model>>;
    updateAll(documents: object | object[]): Promise<Collection<Model>>;
    delete(): Promise<IEloquent<Model>>;

    // selection
    select(columns?: string | string[]): IEloquent<Model>;
    column(column: TColumnOption): IEloquent<Model>;

    // find methods
    find(id: string | number): Promise<Model | null>;
    findOrFail(id: string | number): Promise<Model>;
    
    // get methods
    all(): Promise<Collection<Model>>;
    get(): Promise<Collection<Model>>;
    first(): Promise<Model | null>;
    firstOrFail(): Promise<Model>
    last(): Promise<Model | null>;
    lastOrFail(): Promise<Model>

    // Select methods
    select(columns?: string | string[]): IEloquent<Model>;
    selectRaw(expression: string, bindings?: unknown[]): IEloquent<Model>;
    distinct(columns: string | string[]): IEloquent<Model>;

    // Where methods
    where(filters: object, operator?: TOperator): IEloquent<Model>;
    where(column: string, value?: TWhereClauseValue): IEloquent<Model>;
    where(column: string, operator?: TOperator, value?: TWhereClauseValue, logicalOperator?: TLogicalOperator): IEloquent<Model>;
    whereRaw<Q = unknown, Bindings = unknown>(query: Q, bindings?: Bindings): IEloquent<Model>;

    orWhere(column: string, value?: TWhereClauseValue): IEloquent<Model>;
    orWhere(column: string, operator?: TOperator, value?: TWhereClauseValue): IEloquent<Model>;

    whereIn(column: string, values: TWhereClauseValue[]): IEloquent<Model>;
    whereNotIn(column: string, values: TWhereClauseValue[]): IEloquent<Model>;

    whereLike(column: string, value: TWhereClauseValue): IEloquent<Model>;
    whereNotLike(column: string, value: TWhereClauseValue): IEloquent<Model>;

    whereNull(column: string): IEloquent<Model>;
    whereNotNull(column: string): IEloquent<Model>;

    whereBetween(column: string, range: [TWhereClauseValue, TWhereClauseValue]): IEloquent<Model>;
    whereNotBetween(column: string, range: [TWhereClauseValue, TWhereClauseValue]): IEloquent<Model>;

    // Joins
    join(relatedTable: string, localColumn: string, relatedColumn: string): IEloquent<Model>;
    fullJoin(relatedTable: string, localColumn: string, relatedColumn: string): IEloquent<Model>;
    leftJoin(relatedTable: string, localColumn: string, relatedColumn: string): IEloquent<Model>;
    rightJoin(relatedTable: string, localColumn: string, relatedColumn: string): IEloquent<Model>;
    crossJoin(table: string): IEloquent<Model>;
    with(relationship: string): IEloquent<Model>;

    // Ordering
    orderBy(column: string, direction?: TDirection): IEloquent<Model>;
    latest(column?: string): IEloquent<Model>;
    newest(column?: string): IEloquent<Model>;
    oldest(column?: string): IEloquent<Model>;

    // Grouping
    groupBy(columns: string[] | string | null): IEloquent<Model>;
    // having(column: string, operator?: string, value?: any): Promise<IQueryBuilder>;

    // Limiting
    limit(limit: number): IEloquent<Model>;
    offset(offset: number): IEloquent<Model>;
    skip(skip: number): IEloquent<Model>;
    take(take: number): IEloquent<Model>;

    // Aggregates
    count(column?: string): Promise<number>;
    max(column: string): Promise<number>;
    min(column: string): Promise<number>;
    avg(column: string): Promise<number>;
    sum(column: string): Promise<number>;

    // Transaction
    transaction(callbackFn: TransactionFn<Model>): Promise<void>;

    // Cloning 
    clone(): IEloquent<Model>;
}