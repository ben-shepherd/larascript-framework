/* eslint-disable no-unused-vars */
import { TColumnOption, TGroupBy, TJoin, TLogicalOperator, TOffsetLimit, TOperator, TOrderBy, TWhereClause, TWhereClauseValue, TWith } from "@src/core/domains/eloquent/interfaces/IEloquent";

interface IEloquentExpression<BindingsUtility = unknown> {

    bindingsUtility: BindingsUtility | null;

    /**
     * Abstract class representing a builder for a database query expression.
     * 
     * All concrete implementations of this interface must implement the build
     * method which should return the built expression.
     * 
     * @template T - The type of object returned by the build method
     */
    build<T = unknown>(): T;

    /**
     * Gets the current table name.
     * 
     * @returns {string} The current table name.
     */
    getTable(): string;

    /**
     * Sets the table name and optional abbreviation for the query builder.
     * 
     * @param {string} table The table name to set.
     * @param {string} [abbreviation] The abbreviation for the table name.
     * @returns {this} The query builder instance.
     */
    setTable(table: string, abbreviation?: string): this;

    /**
     * Sets the build type to 'select'.
     * 
     * @returns {this} The instance of the query builder for method chaining.
     */
    setSelect(): this;

    /**
     * Sets the build type to 'selectRaw'.
     * 
     * @returns {this} The instance of the query builder for method chaining.
     */
    setSelectRaw<RawSelect = unknown>(rawSelect: RawSelect, bindings?: BindingsUtility): this;

    /**
     * Gets the current raw select.
     * 
     * @returns {RawSelect | null} The current raw select.
     */
    getRawSelect<RawSelect = unknown>(): RawSelect | null;

    /**
     * Gets the current columns in the SQL query.
     * 
     * @returns {TColumnOption[]} The current columns.
     */
    getColumns(): TColumnOption[];

    /**
     * Sets the columns to include in the SQL query.
     * 
     * @param {TColumnOption[]} columns - The array of column names to set for the query.
     * @returns {this} The instance of the query builder for method chaining.
     */
    setColumns(columns: TColumnOption[]): this;

    /**
     * Adds a column to the columns array to be included in the SQL query.
     * If the column is already in the array, it will not be added again.
     * 
     * @param {TColumnOption} column - The column name to add to the array.
     * @returns {this} The instance of the query builder for method chaining.
     */
    addColumn(column: TColumnOption): this;

    /**
     * Gets the distinct columns for the query builder.
     * 
     * @returns {TColumnOption[]} The current distinct columns.
     */
    getDistinctColumns(): TColumnOption[];

    /**
     * Sets the distinct columns for the query builder.
     * 
     * @param {TColumnOption[]} columns - The array of column names to set for the query.
     * @returns {this} The instance of the query builder for method chaining.
     */
    setDistinctColumns(columns: TColumnOption[]): this;

    setBindings(bindings: BindingsUtility): this;
    
    getBindings(): BindingsUtility | null;

    /**
     * Gets the current where clauses.
     * 
     * @returns {TWhereClause[]} The current where clauses.
     */
    getWhere(): TWhereClause[];

    /**
     * Sets the where clauses for the query builder.
     * @param {TWhereClause[]} where The array of where clauses to set.
     * @returns {this} The query builder instance.
     */
    setWhere(where: TWhereClause[]): this;

    /**
     * Adds a where clause to the query builder.
     * 
     * @param {TWhereClause} where - The where clause to add.
     * @returns {this} The query builder instance for chaining.
     */
    addWhere(where: TWhereClause): this;

    /**
     * Adds a where clause to the query builder.
     * 
     * @param {string} column - The column to apply the where condition on.
     * @param {TOperator} operator - The operator to use for comparison.
     * @param {TWhereClauseValue | TWhereClauseValue[]} value - The value or values to compare against.
     * @returns {this} The query builder instance for chaining.
     */
    where(column: string, operator: TOperator, value: TWhereClauseValue | TWhereClauseValue[], logicalOperator?: TLogicalOperator): this;

    /**
     * Adds a raw where clause to the query builder.
     * 
     * @param {string} sql - The raw SQL string for the where clause.
     * @param {unknown} [bindings] - The bindings to use with the raw SQL.
     * @returns {this} The query builder instance for chaining.
     */
    whereRaw(sql: string, bindings?: unknown): this;

    /**
     * Gets the current raw where.
     * 
     * @returns {T | null} The current raw where.
     */
    getRawWhere<T = unknown>(): T | null;

    /**
     * Gets the current order by clauses.
     * 
     * @returns {TOrderBy[]} The current order by clauses.
     */
    getOrderBy(): TOrderBy[] | null;

    /**
     * Sets the order by clauses for the query builder.
     * 
     * @param {TOrderBy[]} orderBy - The array of order by clauses to set.
     * @returns {this} The query builder instance for chaining.
     */
    setOrderBy(orderBy: TOrderBy[] | null): this;
    
    /**
     * Adds an order by clause to the query builder.
     * 
     * @param {TOrderBy} orderBy - The order by clause to add.
     * @returns {this} The query builder instance for chaining.
     */
    orderBy(orderBy: TOrderBy): this;

    /**
     * Sets the offset clause for the query builder.
     * 
     * Example: LIMIT 10 OFFSET 10
     * 
     * @param {TOffsetLimit | null} [offset] - The offset clause to set.
     * @returns {this} The query builder instance for chaining.
     */
    setOffsetAndLimit(offset: TOffsetLimit | null): this;

    /**
     * Sets the limit clause for the query builder.
     * 
     * Example: LIMIT 10
     * 
     * @param {number} limit - The limit clause to set.
     * @returns {this} The query builder instance for chaining.
     */
    setLimit(limit: number | null): this;

    /**
     * Sets the offset for the query builder.
     * 
     * @param {number | null} offset - The value of the offset to set.
     * @returns {this} The query builder instance for chaining.
     */
    setOffset(offset: number | null): this;

    /**
     * Retrieves the offset and limit for the query builder.
     * 
     * @returns {TOffsetLimit} The offset and limit.
     */
    getOffsetLimit(): TOffsetLimit | null;

    /**
     * Gets the current joins.
     * 
     * @returns {TJoin[]} The current joins.
     */
    getJoins(): TJoin[];

    /**
     * Sets the joins for the query builder.
     * 
     * @param {TJoin | TJoin[]} joins - The joins to set. If an array is provided, multiple joins will be applied.
     * @returns {this} The query builder instance for chaining.
     */
    setJoins(joins: TJoin[] | TJoin): this;

    /**
     * Adds a join to the query builder.
     * 
     * @param options 
     * @returns {this} The query builder instance for chaining.
     */
    join(options: TJoin): this;

    /**
     * Gets the current withs.
     * 
     * @returns {TWith[]} The current withs.
     */
    getWiths(): TWith[];

    /**
     * Sets the withs for the query builder.
     * 
     * @param {TWith | TWith[]} withs - The withs to set. If an array is provided, multiple withs will be applied.
     * @returns {this} The query builder instance for chaining.
     */
    setWiths(withs: TWith[]): this;

    /**
     * Adds a with to the query builder.
     * 
     * @param {TWith} with - The with to add.
     * @returns {this} The query builder instance for chaining.
     */
    with(options: TWith): this;

    /**
     * Gets the current documents to insert.
     * 
     * @returns {object | object[] | null} The current documents to insert.
     */
    getInsert(): object | object[] | null;

    /**
     * Sets the documents to insert for the query builder.
     * 
     * @param {object | object[]} documents - The documents to insert.
     * @returns {this} The query builder instance for chaining.
     */
    setInsert(documents: object | object[]): this;

    /**
     * Gets the current document to update.
     * 
     * @returns {object | object[] | null} The current document to update.
     */
    getUpdate(): object | object[] | null;

    /**
     * Sets the document to update for the query builder.
     * 
     * @param {object | object[]} document - The document to update.
     * @returns {this} The query builder instance for chaining.
     */
    setUpdate(document: object | object[]): this;

    /**
     * Gets the current group by columns.
     * 
     * @returns {string[]} The current group by columns.
     */
    getGroupBy(): TGroupBy[] | null;

    /**
     * Sets the group by columns for the query builder.
     * 
     * @param {string[]} columns - The columns to group by.
     * @returns {this} The query builder instance for chaining.
     */
    setGroupBy(columns: TGroupBy[] | null): this;

    /**
     * Sets the delete clause for the query builder.
     * 
     * @returns {this} The query builder instance for chaining.
     */
    setDelete(): this

    /**
     * Returns a clone of the query builder.
     * 
     * @returns {IEloquentExpression<BindingsUtility>} A clone of the query builder.
     */
    clone(): IEloquentExpression<BindingsUtility>;
}

export default IEloquentExpression;