import BaseExpression from "@src/core/domains/eloquent/base/BaseExpression";
import ExpressionException from "@src/core/domains/eloquent/exceptions/ExpressionException";
import InsertException from "@src/core/domains/eloquent/exceptions/InsertException";
import { TColumn, TJoin, TLogicalOperator, TOffsetLimit, TOperator, TOrderBy, TWhereClause, TWhereClauseValue, TWith } from "@src/core/domains/eloquent/interfaces/IEloquent";
import IEloquentExpression from "@src/core/domains/eloquent/interfaces/IEloquentExpression";
import { z } from "zod";

import BindingsHelper from "../BindingsHelper";
import FromTable from "./Clauses/FromTable";
import Insert from "./Clauses/Insert";
import Joins from "./Clauses/Joins";
import OffsetLimit from "./Clauses/OffsetLimit";
import OrderBy from "./Clauses/OrderBy";
import SelectColumns from "./Clauses/SelectColumns";
import Update from "./Clauses/Update";
import Where from "./Clauses/Where";

type BuildType = 'select' | 'insert' | 'update';

type RawSelect = { sql: string, bindings: unknown };

type RawWhere = { sql: string, bindings: unknown };

const getDefaults = () => ({
    buildType: 'select',
    bindings: new BindingsHelper(),
    table: '',
    tableAbbreviation: null,
    columns: [],
    rawSelect: null,
    distinctColumns: null,
    whereClauses: [],
    whereColumnTypes: {},
    whereRaw: null,
    joins: [],
    withs: [],
    orderByClauses: [],
    offset: null,
    inserts: null,
    updates: null,
})

class SqlExpression extends BaseExpression implements IEloquentExpression {

    public bindings                                    = getDefaults().bindings;

    protected buildType: BuildType                     = getDefaults().buildType as BuildType;
    
    protected table: string                            = getDefaults().table;
    
    protected tableAbbreviation?: string | null        = getDefaults().tableAbbreviation;
    
    protected columns: TColumn[]                       = getDefaults().columns;

    protected rawSelect: RawSelect | null              = getDefaults().rawSelect;
    
    protected distinctColumns: TColumn[] | null        = getDefaults().distinctColumns;
    
    protected whereClauses: TWhereClause[]             = getDefaults().whereClauses;
    
    protected whereColumnTypes: Record<string, string> = getDefaults().whereColumnTypes;

    protected rawWhere: RawWhere | null                = getDefaults().whereRaw;
    
    protected joins: TJoin[]                           = getDefaults().joins;

    protected withs: TWith[]                           = getDefaults().withs;
    
    protected orderByClauses: TOrderBy[]               = getDefaults().orderByClauses;
    
    protected offsetLimit: TOffsetLimit | null         = getDefaults().offset;
    
    protected inserts: object | object[] | null        = getDefaults().inserts;

    protected updates: object | object[] | null        = getDefaults().updates;

    public static readonly formatColumnWithQuotes = (column: string): string => {
        if(column.startsWith('"') && column.endsWith('"')){
            return column
        }
        return `"${column}"`
    };

    /**
     * Formats a column name with double quotes for safe usage in SQL queries
     * @param column - The column name to format
     * @returns The formatted column name
     */
    public static formatColumn<T extends TColumn | TColumn[] = TColumn>(column: T): T {

        /**
         * Formats a column name with double quotes for safe usage in SQL queries
         * @param {TColumn} col - The column name to format
         * @returns {TColumn} The formatted column name
         * @private
         */
        const format = (col: TColumn): TColumn => {
            if(col.isFormatted) {
                return col
            }
            col.column = this.formatColumnWithQuotes(col.column);
            return col
        }

        if(Array.isArray(column)) {
            return column.map(format) as T;
        }

        return format(column) as T;
    }

    
    /**
     * Validates that the given array contains only objects
     * @throws InsertException if the array contains a non-object value
     * @param objects - The array to validate
     */
    protected validateArrayObjects(objects: object[], message = 'Expected an array of objects') {
        const schema = z.array(z.object({}));

        if(!schema.safeParse(objects).success) {
            throw new InsertException(message);
        }
    }

    setOffsetLimit(offsetLimit: TOffsetLimit | null): this {
        this.offsetLimit = offsetLimit
        return this
    }

    getTable(): string {
        return this.table
    }
    
    getColumns(): TColumn[] {
        return this.columns
    }

    getDistinctColumns(): TColumn[] {
        return this.distinctColumns || []
    }

    getWhereClauses(): TWhereClause[] {
        return this.whereClauses
    }

    getJoins(): TJoin[] {
        return this.joins
    }

    getWiths(): TWith[] {
        return this.withs
    }

    getOrderBy(): TOrderBy[] {
        return this.orderByClauses
    }

    getOffsetLimit(): TOffsetLimit | null {
        return this.offsetLimit
    }

    getInserts(): object | object[] | null {
        return this.inserts
    }

    getUpdates(): object | object[] | null {
        return this.updates
    }

    getRawSelect(): RawSelect | null {
        return this.rawSelect
    }

    getRawWhere(): RawWhere | null {
        return this.rawWhere
    }

    getBindings(): BindingsHelper {
        return this.bindings
    }

    getWhere(): TWhereClause[] {
        return this.whereClauses
    }

    getInsert(): object | object[] | null {
        return this.inserts
    }

    getUpdate(): object | object[] | null {
        return this.updates
    }

    getWhereColumnTypes(): Record<string, string> {
        return this.whereColumnTypes
    }

    setWhereColumnTypes(whereColumnTypes: Record<string, string>) {
        this.whereColumnTypes = whereColumnTypes
        return this
    }

    setWhereClauses(whereClauses: TWhereClause[]) {
        this.whereClauses = whereClauses
        return this
    }

    setOrderByClauses(orderByClauses: TOrderBy[]) {
        this.orderByClauses = orderByClauses
        return this
    }

    setInserts(inserts: object | object[] | null) {
        this.inserts = inserts
        return this
    }

    setUpdates(updates: object | object[] | null) {
        this.updates = updates
        return this
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
            'insert': () => this.buildInsert(),
            'update': () => this.buildUpdate(),
        }

        if(!fnMap[this.buildType]) {
            throw new ExpressionException(`Invalid build type: ${this.buildType}`);
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
            throw new ExpressionException('Inserts must not be empty');
        }

        this.validateArrayObjects(insertsArray);

        return Insert.toSql(this.table, insertsArray, this.bindings);
    }


    /**
     * Builds a SQL query string from the query builder's properties
     *
     * @returns {string} The SQL query string
     */
    buildSelect(): string { 

        const oneSpacePrefix = ' ';
        const selectColumns  = SelectColumns.toSql(this.columns, this.distinctColumns, this.rawSelect ?? undefined).trimEnd();
        const fromTable      = FromTable.toSql(this.table, this.tableAbbreviation).trimEnd();
        const join           = Joins.toSql(this.joins, oneSpacePrefix).trimEnd();
        const where          = Where.toSql(this.whereClauses, this.rawWhere ?? undefined, this.bindings, oneSpacePrefix).trimEnd();
        const orderBy        = OrderBy.toSql(this.orderByClauses, oneSpacePrefix).trimEnd();
        const offsetLimit    = OffsetLimit.toSql(this.offsetLimit ?? {}, oneSpacePrefix).trimEnd();

        let sql = `${selectColumns} ${fromTable}`;
        sql += join;
        sql += where
        sql += orderBy;
        sql += offsetLimit;

        return sql.trimEnd()
    }

    /**
     * Builds an UPDATE query from the query builder's properties.
     * 
     * @returns {string} The SQL UPDATE query string.
     */
    buildUpdate(): string {
        
        const updatesArray = Array.isArray(this.updates) ? this.updates : [this.updates];

        if(updatesArray.length === 0) {
            throw new ExpressionException('Updates must not be empty');
        }

        this.validateArrayObjects(updatesArray);

        return Update.toSql(this.table, updatesArray, this.whereClauses, this.bindings);
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
     * Sets the query type to a SELECT query.
     * 
     * @returns {this} The query builder instance.
     */
    setSelect(): this {
        this.buildType = 'select';
        return this;
    }

    /**
     * Sets the query type to 'select' and assigns a raw SQL expression for the SELECT statement.
     * 
     * @param {string} sql - The raw SQL string for the SELECT query.
     * @param {unknown} bindings - The bindings to be used with the raw SQL.
     * @returns {this} The query builder instance for method chaining.
     */
    setSelectRaw(sql: string, bindings: unknown): this {
        this.buildType = 'select';
        this.rawSelect = { sql, bindings };
        return this
    }

    setRawWhere(where: RawWhere | null): this {
        this.rawWhere = where;
        return this
    }

    /**
     * Sets the columns to include in the SQL query.
     * 
     * @param {string[]} columns - The array of column names to set for the query.
     * @returns {this} The instance of the query builder for method chaining.
     */
    setColumns(columns: TColumn[]): this {
        this.columns = columns;
        return this;
    }

    /**
     * Adds a column to the columns array to be included in the SQL query.
     * If the column is already in the array, it will not be added again.
     * @param {string} column The column name to add to the array.
     * @returns {this} The instance of the query builder for method chaining.
     */
    addColumn(column: TColumn): this {
        this.columns.push(column);
        return this
    }

    setDistinctColumns(columns: TColumn[]): this {
        console.log('[SqlExpression] setDistinctColumns', columns);
        this.distinctColumns = columns;
        return this   
    }

    setBindings(bindings: BindingsHelper): this {
        this.bindings = bindings;
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
    getBindingTypes(): (number | undefined)[] {
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
    where(column: string, operator: TOperator, value: TWhereClauseValue | TWhereClauseValue[] = null, logicalOperator: TLogicalOperator = 'and'): this {
        this.whereClauses.push({ column, operator, value, logicalOperator });
        return this;
    }

    /**
     * Adds a raw where clause to the query builder.
     * 
     * @param {string} sql - The raw SQL to use for the where clause.
     * @param {unknown} bindings - The bindings to use for the where clause.
     * @returns {this} The query builder instance for chaining.
     */
    whereRaw(sql: string, bindings: unknown): this {
        this.rawWhere = { sql, bindings };
        return this
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
     * @param {TOffsetLimit | null} [offset] - The offset clause to set.
     * @returns {this} The query builder instance for chaining.
     */
    setOffsetAndLimit(offset: TOffsetLimit | null = null): this {
        this.offsetLimit = offset;
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
        this.offsetLimit = {limit: limit ?? undefined, offset: this.offsetLimit?.offset};
        return this
    }

    /**
     * Sets the offset for the query builder.
     * 
     * @param {number | null} offset - The value of the offset to set.
     * @returns {this} The query builder instance for chaining.
     */
    setOffset(offset: number | null = null): this {
        this.offsetLimit = { limit: this.offsetLimit?.limit, offset: offset ?? undefined };
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
     * Adds a join to the query builder.
     * 
     * @param {TJoin} options - The join to add.
     * @returns {this} The query builder instance for chaining.
     */
    join(options: TJoin): this {
        this.joins.push(options);
        return this
    }

    /**
     * Sets the withs (common table expressions) for the query builder.
     * 
     * @param {TWith | TWith[]} withs - The withs to set. If an array is provided, multiple withs will be applied.
     * @returns {this} The query builder instance for chaining.
     */
    setWiths(withs: TWith[] | TWith): this {
        this.withs = Array.isArray(withs) ? withs : [withs];
        return this
    }

    /**
     * Adds a with (common table expression) to the query builder.
     * 
     * @param {TWith} options - The with to add.
     * @returns {this} The query builder instance for chaining.
     */
    with(options: TWith): this {
        this.withs.push(options)
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
     * Sets the document to be updated by the query builder.
     * 
     * @param {object | object[]} documents - The document or documents to update.
     * If a single document is provided, it will be wrapped in an array.
     * @returns {this} The query builder instance for chaining.
     */
    setUpdate(documents: object | object[]): this {
        documents = Array.isArray(documents) ? documents : [documents]
        this.updates = documents
        this.buildType = 'update'
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
