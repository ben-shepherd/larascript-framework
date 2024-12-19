/* eslint-disable no-unused-vars */
import { TColumnOption, TGroupBy, TJoin, TLogicalOperator, TOffsetLimit, TOperator, TOrderBy, TWhereClause, TWhereClauseValue, TWith } from "@src/core/domains/eloquent/interfaces/IEloquent";
import IEloquentExpression from "@src/core/domains/eloquent/interfaces/IEloquentExpression";
import { deepClone } from "@src/core/util/deepClone";

export type BuildType = 'select' | 'insert' | 'update' | 'delete';
export type RawSelect = { sql: string, bindings: unknown };
export type RawWhere = { sql: string, bindings: unknown };
export type NullableObjectOrArray = object | object[] | null;
type ExpressionDefaults<BindingsUtility = unknown> = {
    buildType: BuildType;
    table: string;
    tableAbbreviation: string | null;
    bindings: BindingsUtility | null;
    columns: TColumnOption[] | null;
    rawSelect: RawSelect | null;
    distinctColumns: TColumnOption[] | null;
    whereClauses: TWhereClause[] | null;
    whereColumnTypes: Record<string, string> | null;
    whereRaw: RawWhere | null;
    joins: TJoin[] | null;
    withs: TWith[] | null;
    orderByClauses: TOrderBy[] | null;
    offset: TOffsetLimit | null;
    inserts: NullableObjectOrArray | null;
    updates: NullableObjectOrArray | null;
    groupBy: TGroupBy[] | null;
}


abstract class BaseExpression<BindingsUtility = unknown> implements IEloquentExpression<BindingsUtility> {

    bindingsUtility:  BindingsUtility | null                   = this.getDefaults().bindings;

    protected buildType: BuildType                             = this.getDefaults().buildType;

    protected table: string                                    = this.getDefaults().table;

    protected tableAbbreviation?: string | null                = this.getDefaults().tableAbbreviation;

    protected columns: TColumnOption[] | null                  = this.getDefaults().columns;

    protected rawSelect: RawSelect | null                      = this.getDefaults().rawSelect;

    protected distinctColumns: TColumnOption[] | null          = this.getDefaults().distinctColumns;

    protected whereClauses: TWhereClause[] | null              = this.getDefaults().whereClauses;

    protected whereColumnTypes: Record<string, string> | null  = this.getDefaults().whereColumnTypes;

    protected rawWhere: RawWhere | null                        = this.getDefaults().whereRaw;

    protected joins: TJoin[] | null                            = this.getDefaults().joins;

    protected withs: TWith[] | null                            = this.getDefaults().withs;

    protected orderByClauses: TOrderBy[] | null                = this.getDefaults().orderByClauses;

    protected offsetLimit: TOffsetLimit | null                 = this.getDefaults().offset;

    protected inserts: NullableObjectOrArray                   = this.getDefaults().inserts;

    protected updates: NullableObjectOrArray                   = this.getDefaults().updates;

    protected groupBy: TGroupBy[] | null                       = this.getDefaults().groupBy;

    constructor() {
        this.setDefaults()
    }
    
    /**
     * Sets the default values for the expression properties. 
     * 
     * This method allows setting custom default values by merging them with the existing defaults.
     * If no defaults are provided, the current defaults are used.
     *
     * @param {ExpressionDefaults<BindingsUtility>} [defaults] - The custom default values to be merged 
     * with the existing defaults, represented as an ExpressionDefaults object. Default is an empty object.
     */
    protected setDefaults(defaults: ExpressionDefaults<BindingsUtility> = {} as ExpressionDefaults<BindingsUtility>) {
        const values = {
            ...this.getDefaults(),
            ...defaults
        } as ExpressionDefaults<BindingsUtility>

        this.buildType         = values.buildType;
        this.bindingsUtility   = values.bindings;
        this.table             = values.table;
        this.tableAbbreviation = values.tableAbbreviation;
        this.columns           = values.columns;
        this.rawSelect         = values.rawSelect;
        this.distinctColumns   = values.distinctColumns;
        this.whereClauses      = values.whereClauses;
        this.whereColumnTypes  = values.whereColumnTypes;
        this.rawWhere          = values.whereRaw;
        this.joins             = values.joins;
        this.withs             = values.withs;
        this.orderByClauses    = values.orderByClauses;
        this.offsetLimit       = values.offset;
        this.inserts           = values.inserts;
        this.updates           = values.updates;
        this.groupBy           = values.groupBy;
    }

    /**
     * Returns the default values for the expression properties as an ExpressionDefaults object.
     * 
     * The defaults include settings for build type, table details, column selections, 
     * query conditions, joins, ordering, and more. These defaults are used to 
     * initialize the properties of an SQL expression.
     *
     * @returns {ExpressionDefaults<BindingsUtility>} The default values for
     * expression properties.
     */
    protected getDefaults(): ExpressionDefaults<BindingsUtility> {
        return {
            buildType: 'select',
            table: '',
            bindings: null,
            tableAbbreviation: null,
            columns: null,
            rawSelect: null,
            distinctColumns: null,
            whereClauses: null,
            whereColumnTypes: null,
            whereRaw: null,
            joins: null,
            withs: null,
            orderByClauses: null,
            offset: null,
            inserts: null,
            updates: null,
            groupBy: null,
        }
    }

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