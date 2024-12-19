import { TColumnOption, TGroupBy, TJoin, TLogicalOperator, TOffsetLimit, TOperator, TOrderBy, TWhereClause, TWhereClauseValue, TWith } from "@src/core/domains/eloquent/interfaces/IEloquent";
import IEloquentExpression from "@src/core/domains/eloquent/interfaces/IEloquentExpression";

class PipelineBuilder implements IEloquentExpression {

    bindingsUtility: undefined;
    
    getTable(): string {
        throw new Error("Method not implemented.")
    }

    setTable(table: string, abbreviation?: string): this {
        throw new Error("Method not implemented.")
    }

    setSelect(): this {
        throw new Error("Method not implemented.")
    }

    setSelectRaw(sql: string, bindings: unknown): this {
        throw new Error("Method not implemented.")
    }

    getColumns(): TColumnOption[] {
        throw new Error("Method not implemented.")
    }

    setColumns(columns: TColumnOption[]): this {
        throw new Error("Method not implemented.")
    }

    addColumn(column: TColumnOption): this {
        throw new Error("Method not implemented.")
    }

    getDistinctColumns(): TColumnOption[] {
        throw new Error("Method not implemented.")
    }

    setDistinctColumns(columns: TColumnOption[]): this {
        throw new Error("Method not implemented.")
    }

    addBinding(column: string, binding: unknown): this {
        throw new Error("Method not implemented.")
    }

    getBindingValues(): unknown[] {
        throw new Error("Method not implemented.")
    }

    getBindingTypes(): (number | undefined)[] {
        throw new Error("Method not implemented.")
    }

    getWhere(): TWhereClause[] {
        throw new Error("Method not implemented.")
    }

    setWhere(where: TWhereClause[]): this {
        throw new Error("Method not implemented.")
    }

    addWhere(where: TWhereClause): this {
        throw new Error("Method not implemented.")
    }

    where(column: string, operator: TOperator, value: TWhereClauseValue | TWhereClauseValue[], logicalOperator?: TLogicalOperator): this {
        throw new Error("Method not implemented.")
    }

    whereRaw(sql: string, bindings?: unknown): this {
        throw new Error("Method not implemented.")
    }

    getOrderBy(): TOrderBy[] | null {
        throw new Error("Method not implemented.")
    }

    setOrderBy(orderBy: TOrderBy[] | null): this {
        throw new Error("Method not implemented.")
    }

    orderBy(orderBy: TOrderBy): this {
        throw new Error("Method not implemented.")
    }

    setOffsetAndLimit(offset: TOffsetLimit | null): this {
        throw new Error("Method not implemented.")
    }

    setLimit(limit: number | null): this {
        throw new Error("Method not implemented.")
    }

    setOffset(offset: number | null): this {
        throw new Error("Method not implemented.")
    }

    getOffsetLimit(): TOffsetLimit | null {
        throw new Error("Method not implemented.")
    }

    getJoins(): TJoin[] {
        throw new Error("Method not implemented.")
    }

    setJoins(joins: TJoin[] | TJoin): this {
        throw new Error("Method not implemented.")
    }

    join(options: TJoin): this {
        throw new Error("Method not implemented.")
    }

    getWiths(): TWith[] {
        throw new Error("Method not implemented.")
    }

    setWiths(withs: TWith[]): this {
        throw new Error("Method not implemented.")
    }

    with(options: TWith): this {
        throw new Error("Method not implemented.")
    }

    getInsert(): object | object[] | null {
        throw new Error("Method not implemented.")
    }

    setInsert(documents: object | object[]): this {
        throw new Error("Method not implemented.")
    }

    getUpdate(): object | object[] | null {
        throw new Error("Method not implemented.")
    }

    setUpdate(document: object | object[]): this {
        throw new Error("Method not implemented.")
    }

    getGroupBy(): TGroupBy[] | null {
        throw new Error("Method not implemented.")
    }

    setGroupBy(columns: TGroupBy[] | null): this {
        throw new Error("Method not implemented.")
    }

    setDelete(): this {
        throw new Error("Method not implemented.")
    }

    clone(): IEloquentExpression<unknown> {
        throw new Error("Method not implemented.")
    }

    build<T = any[]>(): T {
        return [] as T
    }

}

export default PipelineBuilder