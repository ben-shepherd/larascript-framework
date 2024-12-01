import InsertException from "@src/core/domains/eloquent/exceptions/InsertException";
import { TJoin, TOffset, TOperator, TOrderBy, TWhereClause, TWhereClauseValue } from "@src/core/domains/eloquent/interfaces/IEloquent";
import IEloquentExpression from "@src/core/domains/eloquent/interfaces/IEloquentExpression";
import { z } from "zod";

import BindingsHelper from "../BindingsHelper";
import FromTable from "./Clauses/FromTable";
import Insert from "./Clauses/Insert";
import Joins from "./Clauses/Joins";
import OffsetLimit from "./Clauses/OffsetLimit";
import OrderBy from "./Clauses/OrderBy";
import SelectColumns from "./Clauses/SelectColumns";
import Where from "./Clauses/Where";

type BuildType = 'select' | 'insert'

const getDefaults = () => ({
    buildType: 'select',
    bindings: new BindingsHelper(),
    table: '',
    tableAbbreviation: null,
    columns: ['*'],
    distinctColumns: null,
    whereClauses: [],
    whereColumnTypes: {},
    joins: [],
    orderByClauses: [],
    offset: null,
    inserts: null
})

class SqlExpression implements IEloquentExpression {

    public bindings                                    = getDefaults().bindings;

    protected buildType: BuildType                     = getDefaults().buildType as BuildType;
    
    protected table: string                            = getDefaults().table;
    
    protected tableAbbreviation?: string | null        = getDefaults().tableAbbreviation;
    
    protected columns: string[]                        = getDefaults().columns;
    
    protected distinctColumns: string[] | null         = getDefaults().distinctColumns;
    
    protected whereClauses: TWhereClause[]             = getDefaults().whereClauses;
    
    protected whereColumnTypes: Record<string, string> = getDefaults().whereColumnTypes;
    
    protected joins: TJoin[]                           = getDefaults().joins;
    
    protected orderByClauses: TOrderBy[]               = getDefaults().orderByClauses;
    
    protected offset: TOffset | null                   = getDefaults().offset;
    
    protected inserts: object | object[] | null        = getDefaults().inserts;

    /**
     * Formats a column name with double quotes for safe usage in SQL queries
     * @param column - The column name to format
     * @returns The formatted column name
     */
    public static formatColumn<T extends string | string[] = string>(column: T): T {
        const format = (col) => `"${col}"`;

        if(Array.isArray(column)) {
            return column.map(format) as T;
        }

        return format(column) as T;
    }

    /**
     * Builds a SQL query string from the query builder's properties
     *
     * @returns {string} The SQL query string
     */
    build<T = string>(): T {

        if(this.table.length === 0) {
            throw new Error('Table name is required');
        }

        const fnMap = {
            'select': () => this.buildSelect(),
            'insert': () => this.buildInsert()
        }

        return fnMap[this.buildType]() as T;
    }

    /**
     * Builds a SQL query string from the query builder's properties
     *
     * @returns {string} The SQL query string
     */
    buildInsert(): string {

        const insertsArray = Array.isArray(this.inserts) ? this.inserts : [this.inserts];

        if(insertsArray.length === 0) {
            throw new InsertException('Inserts must not be empty');
        }

        this.validateArrayObjects(insertsArray);

        return Insert.toSql(this.table, insertsArray, this.bindings);
    }

    /**
     * Validates that the given array contains only objects
     * @throws InsertException if the array contains a non-object value
     * @param objects - The array to validate
     */
    protected validateArrayObjects(objects: object[]) {
        const schema = z.array(z.object({}));

        if(!schema.safeParse(objects).success) {
            throw new InsertException('Inserts must be an array of objects');
        }
    }

    /**
     * Builds a SQL query string from the query builder's properties
     *
     * @returns {string} The SQL query string
     */
    buildSelect(): string { 

        const oneSpacePrefix = ' ';
        const selectColumns  = SelectColumns.toSql(this.columns, this.distinctColumns).trimEnd();
        const fromTable      = FromTable.toSql(this.table, this.tableAbbreviation).trimEnd();
        const where          = Where.toSql(this.whereClauses, this.bindings, oneSpacePrefix).trimEnd();
        const join           = Joins.toSql(this.joins, oneSpacePrefix).trimEnd();
        const orderBy        = OrderBy.toSql(this.orderByClauses, oneSpacePrefix).trimEnd();
        const offsetLimit    = OffsetLimit.toSql(this.offset ?? {}, oneSpacePrefix).trimEnd();

        let sql = `${selectColumns} ${fromTable}`;
        sql += where
        sql += join;
        sql += orderBy;
        sql += offsetLimit;

        return sql.trimEnd()
    }

    /**
     * Sets the table name and optional abbreviation for the query builder.
     * 
     * @param {string} table The table name to set.
     * @param {string} [abbreviation] The abbreviation for the table name.
     * @returns {this} The query builder instance.
     */
    setTable(table: string, abbreviation?: string): this {
        this.table = table;
        this.tableAbbreviation = abbreviation ?? null
        return this;
    }

    /**
     * Sets the columns to include in the SQL query.
     * 
     * @param {string[]} columns - The array of column names to set for the query.
     * @returns {this} The instance of the query builder for method chaining.
     */
    setColumns(columns: string[]): this {
        this.columns = columns;
        return this;
    }

    setDistinctColumns(columns: string[]): this {
        console.log('[SqlExpression] setDistinctColumns', columns);
        this.distinctColumns = columns;
        return this   
    }

    /**
     * Adds a single binding to the builder.
     * This method wraps the given binding in an array and passes it to the underlying addBindings method.
     * 
     * @param {unknown} binding The value to bind.
     * @returns {this} The query builder instance.
     */
    addBinding(column: string, binding: unknown): this {
        this.bindings.addBinding(column, binding);
        return this
    }

    /**
     * Retrieves the list of values that have been added to the builder as bindings.

     * @returns {unknown[]} The list of values
     */
    getBindingValues(): unknown[] {
        return this.bindings.getValues();
    }

    /**
     * Retrieves the list of PostgreSQL types that have been added to the builder as bindings.
     
     * @returns {number[]} The list of PostgreSQL types
     */
    getBindingTypes() {
        return this.bindings.getTypes()
    }

    /**
     * Sets the where clauses for the query builder.
     * @param {TWhereClause[]} where The array of where clauses to set.
     * @returns {this} The query builder instance.
     */
    setWhere(where: TWhereClause[]): this {
        this.whereClauses = where;
        return this;
    }

    /**
     * Adds a where clause to the query builder.
     * 
     * @param {string} column - The column to apply the where condition on.
     * @param {TOperator} operator - The operator to use for comparison.
     * @param {TWhereClauseValue | TWhereClauseValue[]} value - The value or values to compare against.
     * @returns {this} The query builder instance for chaining.
     */
    where(column: string, operator: TOperator, value: TWhereClauseValue | TWhereClauseValue[] = null): this {
        this.whereClauses.push({ column, operator, value });
        return this;
    }

    /**
     * Sets the order by clauses for the query builder.
     * 
     * @param {TOrderBy[]} orderBy - The array of order by clauses to set.
     * @returns {this} The query builder instance for chaining.
     */
    setOrderBy(orderBy: TOrderBy[]): this {
        this.orderByClauses = orderBy;
        return this;
    }
    
    /**
     * Adds an order by clause to the query builder.
     * 
     * @param {TOrderBy} orderBy - The order by clause to add.
     * @returns {this} The query builder instance for chaining.
     */
    orderBy(orderBy: TOrderBy): this {
        this.orderByClauses.push(orderBy);
        return this
    }

    /**
     * Sets the offset clause for the query builder.
     * 
     * Example: LIMIT 10 OFFSET 10
     * 
     * @param {TOffset | null} [offset] - The offset clause to set.
     * @returns {this} The query builder instance for chaining.
     */
    setOffsetAndLimit(offset: TOffset | null = null): this {
        this.offset = offset;
        return this;
    }

    /**
     * Sets the limit clause for the query builder.
     * 
     * Example: LIMIT 10
     * 
     * @param {number} limit - The limit clause to set.
     * @returns {this} The query builder instance for chaining.
     */
    setLimit(limit: number | null = null): this {
        this.offset = {limit: limit ?? undefined, offset: this.offset?.offset};
        return this
    }

    /**
     * Sets the offset for the query builder.
     * 
     * @param {number | null} offset - The value of the offset to set.
     * @returns {this} The query builder instance for chaining.
     */
    setOffset(offset: number | null = null): this {
        this.offset = { limit: this.offset?.limit, offset: offset ?? undefined };
        return this
    }

    /**
     * Sets the joins for the query builder.
     * 
     * @param {TJoin | TJoin[]} joins - The joins to set. If an array is provided, multiple joins will be applied.
     * @returns {this} The query builder instance for chaining.
     */
    setJoins(joins: TJoin[] | TJoin): this {
        this.joins = Array.isArray(joins) ? joins : [joins];
        return this        
    }

    /**
     * Sets the documents to be inserted by the query builder.
     * 
     * @param {object | object[]} documents - The document or documents to insert.
     * If a single document is provided, it will be wrapped in an array.
     * @returns {this} The query builder instance for chaining.
     */
    setInsert(documents: object | object[]): this {
        documents = Array.isArray(documents) ? documents : [documents]
        this.inserts = documents
        this.buildType = 'insert'
        return this
    }

    /**
     * Builds a SQL query string from the query builder's properties.
     * 
     * @returns {string} The SQL query string
     */
    toSql(): string {
        return this.buildSelect();
    }
    
}

export default SqlExpression
