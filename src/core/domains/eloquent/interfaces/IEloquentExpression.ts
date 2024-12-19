/* eslint-disable no-unused-vars */
import { TColumnOption, TGroupBy, TJoin, TLogicalOperator, TOffsetLimit, TOperator, TOrderBy, TWhereClause, TWhereClauseValue, TWith } from "@src/core/domains/eloquent/interfaces/IEloquent";

interface IEloquentExpression<BindingsUtility = unknown> {

    // Build final expression
    build<T = unknown>(): T;

    // Utility methods
    bindingsUtility: BindingsUtility | null;
    setBindings(bindings: BindingsUtility): this;
    getBindings(): BindingsUtility | null;
    clone(): IEloquentExpression<BindingsUtility>;

    // Table operations
    getTable(): string;
    setTable(table: string, abbreviation?: string): this;

    // Select operations
    setSelect(): this;
    setSelectRaw<T = unknown>(rawSelect: T, bindings?: BindingsUtility): this;
    getRawSelect<T = unknown>(): T | null;

    // Column operations
    getColumns(): TColumnOption[];
    setColumns(columns: TColumnOption[]): this;
    addColumn(column: TColumnOption): this;
    getDistinctColumns(): TColumnOption[];
    setDistinctColumns(columns: TColumnOption[]): this;

    // Where operations
    getWhere(): TWhereClause[];
    setWhere(where: TWhereClause[]): this;
    addWhere(where: TWhereClause): this;
    where(column: string, operator: TOperator, value: TWhereClauseValue | TWhereClauseValue[], logicalOperator?: TLogicalOperator): this;
    whereRaw(sql: string, bindings?: unknown): this;
    getRawWhere<T = unknown>(): T | null;

    // Order operations
    getOrderBy(): TOrderBy[] | null;
    setOrderBy(orderBy: TOrderBy[] | null): this;
    orderBy(orderBy: TOrderBy): this;

    // Pagination operations
    setOffsetAndLimit(offset: TOffsetLimit | null): this;
    setLimit(limit: number | null): this;
    setOffset(offset: number | null): this;
    getOffsetLimit(): TOffsetLimit | null;

    // Join operations
    getJoins(): TJoin[];
    setJoins(joins: TJoin[] | TJoin): this;
    join(options: TJoin): this;

    // With operations
    getWiths(): TWith[];
    setWiths(withs: TWith[]): this;
    with(options: TWith): this;

    // Insert operations
    getInsert(): object | object[] | null;
    setInsert(documents: object | object[]): this;

    // Update operations
    getUpdate(): object | object[] | null;
    setUpdate(document: object | object[]): this;

    // Group operations
    getGroupBy(): TGroupBy[] | null;
    setGroupBy(columns: TGroupBy[] | null): this;

    // Delete operations
    setDelete(): this;
}

export default IEloquentExpression;