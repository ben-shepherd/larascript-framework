import BaseExpression from "@src/core/domains/eloquent/base/BaseExpression";
import { TColumnOption, TGroupBy, TJoin, TLogicalOperator, TOffsetLimit, TOperator, TOrderBy, TWhereClause, TWhereClauseValue, TWith } from "@src/core/domains/eloquent/interfaces/IEloquent";

class PipelineBuilder extends BaseExpression<unknown> {

    bindingsUtility: unknown;

    setTable(table: string, abbreviation?: string): this {
        return this;
    }

    getTable(): string {
        return '';
    }

    setBuildTypeSelect(): this {
        return this;
    }

    setSelectRaw(sql: string, bindings: unknown): this {
        return this;
    }

    setColumns(columns: TColumnOption[]): this {
        return this;
    }

    getColumns(): TColumnOption[] {
        return [];
    }

    addColumn(column: TColumnOption): this {
        return this;
    }

    setDistinctColumns(columns: TColumnOption[]): this {
        return this;
    }

    getDistinctColumns(): TColumnOption[] {
        return [];
    }

    addBinding(column: string, binding: unknown): this {
        return this;
    }

    setWhere(where: TWhereClause[]): this {
        return this;
    }

    addWhere(where: TWhereClause): this {
        return this;
    }

    getWhere(): TWhereClause[] {
        return [];
    }

    where(column: string, operator: TOperator, value: TWhereClauseValue | TWhereClauseValue[], logicalOperator?: TLogicalOperator): this {
        return this;
    }

    whereRaw(sql: string, bindings?: unknown): this {
        return this;
    }

    setOrderBy(orderBy: TOrderBy[]): this {
        return this;
    }

    getOrderBy(): TOrderBy[] | null {
        return null;
    }

    orderBy(orderBy: TOrderBy): this {
        return this;
    }

    setOffsetAndLimit(offset: TOffsetLimit | null): this {
        return this;
    }

    setLimit(limit: number | null): this {
        return this;
    }

    setOffset(offset: number | null): this {
        return this;
    }

    getOffsetLimit(): TOffsetLimit | null {
        return null;
    }

    setJoins(joins: TJoin[] | TJoin): this {
        return this;
    }

    getJoins(): TJoin[] {
        return [];
    }

    join(options: TJoin): this {
        return this;
    }

    setWiths(withs: TWith[]): this {
        return this;
    }

    getWiths(): TWith[] {
        return [];
    }

    with(options: TWith): this {
        return this;
    }

    setBuildTypeInsert(documents: object | object[]): this {
        return this;
    }

    getInsert(): object | object[] | null {
        return null;
    }

    setBuildTypeUpdate(document: object | object[]): this {
        return this;
    }

    getUpdate(): object | object[] | null {
        return null;
    }

    setGroupBy(columns: TGroupBy[]): this {
        return this;
    }

    getGroupBy(): TGroupBy[] | null {
        return null;
    }

    setBuildTypeDelete(): this {
        return this;
    }

    build<T = any[]>(): T {
        return [] as T
    }

}

export default PipelineBuilder