/* eslint-disable no-unused-vars */
import { TColumnOption, TJoin, TLogicalOperator, TOffsetLimit, TOperator, TOrderBy, TWhereClause, TWhereClauseValue, TWith } from "@src/core/domains/eloquent/interfaces/IEloquent";
import { deepClone } from "@src/core/util/deepClone";

import IEloquentExpression from "../interfaces/IEloquentExpression";

abstract class BaseExpression<Bindings = unknown> implements IEloquentExpression<Bindings> {

    abstract bindings: Bindings;

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

    abstract getBindingValues(): unknown[];

    abstract getBindingTypes(): (number | undefined)[];

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

    abstract getOrderBy(): TOrderBy[];

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

    /**
     * Clones the query builder expression.
     *
     * @returns {IEloquentExpression<Bindings>} A new cloned query builder expression.
     */
    clone(): IEloquentExpression<Bindings> {
        return deepClone(this);
    }

}

export default BaseExpression;