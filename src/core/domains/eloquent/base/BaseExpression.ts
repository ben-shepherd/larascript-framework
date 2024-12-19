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
    rawSelect: unknown;
    distinctColumns: TColumnOption[] | null;
    whereClauses: TWhereClause[] | null;
    whereColumnTypes: Record<string, string> | null;
    whereRaw: unknown;
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

    protected rawSelect: unknown                               = this.getDefaults().rawSelect;

    protected distinctColumns: TColumnOption[] | null          = this.getDefaults().distinctColumns;

    protected whereClauses: TWhereClause[] | null              = this.getDefaults().whereClauses;

    protected whereColumnTypes: Record<string, string> | null  = this.getDefaults().whereColumnTypes;

    protected rawWhere: unknown                                = this.getDefaults().whereRaw;

    protected joins: TJoin[] | null                            = this.getDefaults().joins;

    protected withs: TWith[] | null                            = this.getDefaults().withs;

    protected orderByClauses: TOrderBy[] | null                = this.getDefaults().orderByClauses;

    protected offsetLimit: TOffsetLimit | null                 = this.getDefaults().offset;

    protected inserts: NullableObjectOrArray                   = this.getDefaults().inserts;

    protected updates: NullableObjectOrArray                   = this.getDefaults().updates;

    protected groupBy: TGroupBy[] | null                       = this.getDefaults().groupBy;
    
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
     * Builds and returns the final expression result.
     * 
     * @template T - The type of the built expression result
     * @returns {T} The constructed expression result
     */
    abstract build<T = unknown>(): T;

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

    // Table Methods
    setTable(table: string, abbreviation?: string): this {
        this.table = table;
        this.tableAbbreviation = abbreviation ?? null
        return this;
    }
    
    getTable(): string {
        return this.table
    }

    // Column Methods
    setColumns(columns: TColumnOption[]): this {
        this.columns = columns;
        return this;
    }
    
    addColumn(column: TColumnOption): this {
        if (!this.columns) this.columns = [];
        this.columns.push(column);
        return this
    }
    
    getColumns(): TColumnOption[] {
        return this.columns ?? []
    }
    
    setDistinctColumns(columns: TColumnOption[]): this {
        console.log('[SqlExpression] setDistinctColumns', columns);
        this.distinctColumns = columns;
        return this   
    }
    
    getDistinctColumns(): TColumnOption[] {
        return this.distinctColumns || []
    }
    

    abstract setSelect(): this;

    abstract setSelectRaw<T = unknown>(value: T, bindings?: BindingsUtility): this;

    abstract getRawSelect<T = unknown>(): T | null;

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

    abstract whereRaw<T = unknown>(value: T, bindings?: unknown): this;

    abstract getRawWhere<T = unknown>(): T | null;

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

    abstract setDelete(): this;

    // Order By Methods
    setOrderBy(orderBy: TOrderBy[] | null): this {
        this.orderByClauses = orderBy;
        return this;
    }
        
    orderBy(orderBy: TOrderBy): this {
        if(!this.orderByClauses) this.orderByClauses = [];
        this.orderByClauses.push(orderBy);
        return this
    }
    
    getOrderBy(): TOrderBy[] | null {
        return this.orderByClauses ?? []
    }
    
    setOrderByClauses(orderByClauses: TOrderBy[]) {
        this.orderByClauses = orderByClauses
        return this
    }

    // Group By Methods
    getGroupBy(): TGroupBy[] | null {
        return this.groupBy
    }
    
    setGroupBy(columns: TGroupBy[]): this {
        this.groupBy = columns
        return this
    }

    // Offset/Limit Methods
    setOffsetLimit(offsetLimit: TOffsetLimit | null): this {
        this.offsetLimit = offsetLimit
        return this
    }
    
    setOffsetAndLimit(offset: TOffsetLimit | null = null): this {
        this.offsetLimit = offset;
        return this;
    }
    
    setLimit(limit: number | null = null): this {
        this.offsetLimit = {limit: limit ?? undefined, offset: this.offsetLimit?.offset};
        return this
    }
    
    setOffset(offset: number | null = null): this {
        this.offsetLimit = { limit: this.offsetLimit?.limit, offset: offset ?? undefined };
        return this
    }
    
    getOffsetLimit(): TOffsetLimit | null {
        return this.offsetLimit
    }

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