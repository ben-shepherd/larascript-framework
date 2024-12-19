/* eslint-disable no-unused-vars */
import { TColumnOption, TGroupBy, TJoin, TLogicalOperator, TOffsetLimit, TOperator, TOrderBy, TWhereClause, TWhereClauseValue, TWith } from "@src/core/domains/eloquent/interfaces/IEloquent";
import IEloquentExpression from "@src/core/domains/eloquent/interfaces/IEloquentExpression";
import { deepClone } from "@src/core/util/deepClone";

abstract class BaseExpression<BindingsUtility = unknown> implements IEloquentExpression<BindingsUtility> {

    abstract bindingsUtility: BindingsUtility;

    abstract build<T = unknown>(): T;

    abstract setTable(table: string, abbreviation?: string): this;

    abstract getTable(): string;

    abstract setSelect(): this;

    abstract setSelectRaw(sql: string, bindings: unknown): this;

    abstract setColumns(columns: TColumnOption[]): this;

    abstract getColumns(): TColumnOption[];

    abstract addColumn(column: TColumnOption): this;

    abstract setDistinctColumns(columns: TColumnOption[]): this;

    abstract getDistinctColumns(): TColumnOption[];

    abstract addBinding(column: string, binding: unknown): this;

    abstract setWhere(where: TWhereClause[]): this;

    abstract addWhere(where: TWhereClause): this;

    abstract getWhere(): TWhereClause[];

    abstract where(
        column: string, 
        operator: TOperator, 
        value: TWhereClauseValue | TWhereClauseValue[], 
        logicalOperator?: TLogicalOperator
    ): this;

    abstract whereRaw(sql: string, bindings?: unknown): this;

    abstract setOrderBy(orderBy: TOrderBy[]): this;

    abstract getOrderBy(): TOrderBy[] | null;

    abstract orderBy(orderBy: TOrderBy): this;

    abstract setOffsetAndLimit(offset: TOffsetLimit | null): this;

    abstract setLimit(limit: number | null): this;

    abstract setOffset(offset: number | null): this;

    abstract getOffsetLimit(): TOffsetLimit | null;

    abstract setJoins(joins: TJoin[] | TJoin): this;

    abstract getJoins(): TJoin[];

    abstract join(options: TJoin): this;

    abstract setWiths(withs: TWith[]): this;

    abstract getWiths(): TWith[];

    abstract with(options: TWith): this;

    abstract setInsert(documents: object | object[]): this;

    abstract getInsert(): object | object[] | null;

    abstract setUpdate(document: object | object[]): this;

    abstract getUpdate(): object | object[] | null;

    abstract setGroupBy(columns: TGroupBy[]): this;

    abstract getGroupBy(): TGroupBy[] | null;

    abstract setDelete(): this;

    /**
     * Clones the query builder expression.
     *
     * @returns {IEloquentExpression<BindingsUtility>} A new cloned query builder expression.
     */
    clone(): IEloquentExpression<BindingsUtility> {
        return deepClone(this);
    }

}

export default BaseExpression;