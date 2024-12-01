/* eslint-disable no-unused-vars */
import { TJoin, TOffset, TOperator, TOrderBy, TWhereClause, TWhereClauseValue } from "@src/core/domains/eloquent/interfaces/IEloquent";

interface IEloquentExpression<Bindings = unknown> {

    /**
     * Binding utility
     */
    bindings: Bindings;

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
     * Sets the columns to include in the SQL query.
     * 
     * @param {string[]} columns - The array of column names to set for the query.
     * @returns {this} The instance of the query builder for method chaining.
     */
    setColumns(columns: string[]): this;

    /**
     * Sets the distinct columns for the query builder.
     * 
     * @param {string[]} columns - The array of column names to set for the query.
     * @returns {this} The instance of the query builder for method chaining.
     */
    setDistinctColumns(columns: string[]): this;

    /**
     * Adds a single binding to the builder.
     * This method wraps the given binding in an array and passes it to the underlying addBindings method.
     * 
     * @param {unknown} binding The value to bind.
     * @returns {this} The query builder instance.
     */
    addBinding(column: string, binding: unknown): this;

    /**
     * Retrieves the list of values that have been added to the builder as bindings.
     * @returns {unknown[]} The list of values
     */
    getBindingValues(): unknown[];

    /**
     * Retrieves the list of column types that have been added to the builder as bindings.
     * @returns {number[]} The list of column types
     */
    getBindingTypes(): number[];

    /**
     * Sets the where clauses for the query builder.
     * @param {TWhereClause[]} where The array of where clauses to set.
     * @returns {this} The query builder instance.
     */
    setWhere(where: TWhereClause[]): this;

    /**
     * Adds a where clause to the query builder.
     * 
     * @param {string} column - The column to apply the where condition on.
     * @param {TOperator} operator - The operator to use for comparison.
     * @param {TWhereClauseValue | TWhereClauseValue[]} value - The value or values to compare against.
     * @returns {this} The query builder instance for chaining.
     */
    where(column: string, operator: TOperator, value: TWhereClauseValue | TWhereClauseValue[]): this;

    /**
     * Sets the order by clauses for the query builder.
     * 
     * @param {TOrderBy[]} orderBy - The array of order by clauses to set.
     * @returns {this} The query builder instance for chaining.
     */
    setOrderBy(orderBy: TOrderBy[]): this;
    
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
     * @param {TOffset | null} [offset] - The offset clause to set.
     * @returns {this} The query builder instance for chaining.
     */
    setOffsetAndLimit(offset: TOffset | null): this;

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
     * Sets the joins for the query builder.
     * 
     * @param {TJoin | TJoin[]} joins - The joins to set. If an array is provided, multiple joins will be applied.
     * @returns {this} The query builder instance for chaining.
     */
    setJoins(joins: TJoin[] | TJoin): this;

    /**
     * Sets the documents to insert for the query builder.
     * 
     * @param {object | object[]} documents - The documents to insert.
     * @returns {this} The query builder instance for chaining.
     */
    setInsert(documents: object | object[]): this

    /**
     * Sets the document to update for the query builder.
     * 
     * @param {object | object[]} document - The document to update.
     * @returns {this} The query builder instance for chaining.
     */
    setUpdate(document: object | object[]): this;

}

export default IEloquentExpression;