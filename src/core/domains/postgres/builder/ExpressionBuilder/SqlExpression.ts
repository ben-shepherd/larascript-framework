import BaseExpression from "@src/core/domains/eloquent/base/BaseExpression";
import ExpressionException from "@src/core/domains/eloquent/exceptions/ExpressionException";
import { TColumnOption, TGroupBy, TJoin, TLogicalOperator, TOffsetLimit, TOperator, TOrderBy, TWhereClause, TWhereClauseValue, TWith } from "@src/core/domains/eloquent/interfaces/IEloquent";
import IEloquentExpression from "@src/core/domains/eloquent/interfaces/IEloquentExpression";
import { z } from "zod";

import BindingsHelper from "../BindingsHelper";
import DeleteFrom from "./Clauses/DeleteFrom";
import FromTable from "./Clauses/FromTable";
import GroupBy from "./Clauses/GroupBy";
import Insert from "./Clauses/Insert";
import Joins from "./Clauses/Joins";
import OffsetLimit from "./Clauses/OffsetLimit";
import OrderBy from "./Clauses/OrderBy";
import SelectColumns from "./Clauses/SelectColumns";
import Update from "./Clauses/Update";
import Where from "./Clauses/Where";

type BuildType = 'select' | 'insert' | 'update' | 'delete';
type RawSelect = { sql: string, bindings: unknown };
type RawWhere = { sql: string, bindings: unknown };
type NullableObjectOrArray = object | object[] | null;

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
    orderByClauses: null,
    offset: null,
    inserts: null,
    updates: null,
    groupBy: null,
})

class SqlExpression extends BaseExpression implements IEloquentExpression {

    // Class Properties
    public bindings                                    = getDefaults().bindings;

    protected buildType: BuildType                     = getDefaults().buildType as BuildType;

    protected table: string                            = getDefaults().table;

    protected tableAbbreviation?: string | null        = getDefaults().tableAbbreviation;

    protected columns: TColumnOption[]                 = getDefaults().columns;

    protected rawSelect: RawSelect | null              = getDefaults().rawSelect;

    protected distinctColumns: TColumnOption[] | null  = getDefaults().distinctColumns;

    protected whereClauses: TWhereClause[]             = getDefaults().whereClauses;

    protected whereColumnTypes: Record<string, string> = getDefaults().whereColumnTypes;

    protected rawWhere: RawWhere | null                = getDefaults().whereRaw;

    protected joins: TJoin[]                           = getDefaults().joins;

    protected withs: TWith[]                           = getDefaults().withs;

    protected orderByClauses: TOrderBy[] | null        = getDefaults().orderByClauses;

    protected offsetLimit: TOffsetLimit | null         = getDefaults().offset;

    protected inserts: NullableObjectOrArray           = getDefaults().inserts;

    protected updates: NullableObjectOrArray           = getDefaults().updates;

    protected groupBy: TGroupBy[] | null               = getDefaults().groupBy;

    // Static Utility Methods
    public static readonly formatColumnWithQuotes = (column: string): string => {
        if(column === '*') {
            return column
        }
        if(column.startsWith('"') && column.endsWith('"')){
            return column
        }
        return `"${column}"`
    };

    /**
     * Prepares an array of column options for use in a SQL query.
     *
     * This method formats the provided column options, ensuring that each column
     * is properly qualified with quotes. If the option has a preFormattedColumn
     * set to true, the column will not be formatted.
     *
     * @param {TColumnOption[] | TColumnOption} options - The array of column options to prepare.
     * @returns {TColumnOption[] | TColumnOption} The prepared array of column options.
     */
    public static prepareColumnOptions<T extends TColumnOption | TColumnOption[] = TColumnOption>(options: T): T {
        const format = (option: TColumnOption): TColumnOption => {
            if(option.preFormattedColumn) {
                return option
            }

            option.column = this.formatColumnWithQuotes(option.column as string);
            return option
        }

        if(Array.isArray(options)) {
            return options.filter(option => option.column !== null).map(format) as T;
        }

        return format(options) as T;
    }

    // Core Building Methods
    build<T = string>(): T {
        if(this.table.length === 0) {
            throw new Error('Table name is required');
        }

        const fnMap = {
            'select': () => this.buildSelect(),
            'insert': () => this.buildInsert(),
            'update': () => this.buildUpdate(),
            'delete': () => this.buildDelete()
        }

        if(!fnMap[this.buildType]) {
            throw new ExpressionException(`Invalid build type: ${this.buildType}`);
        }

        return fnMap[this.buildType]() as T;
    }

    /**
     * Builds a SELECT SQL query string using the specified query components.
     *
     * This method constructs a SQL SELECT query by combining various parts of
     * the query including columns, table, joins, where clauses, group by, 
     * order by, and offset/limit clauses. Each component is converted to its
     * SQL string representation and combined into a complete SQL query.
     *
     * @returns {string} The fully constructed SQL SELECT query string.
     */
    buildSelect(): string { 

        // Construct the components of the SQL query
        const oneSpacePrefix = ' ';
        const selectColumns  = SelectColumns.toSql(this.columns, this.distinctColumns, this.rawSelect ?? undefined).trimEnd();
        const fromTable      = FromTable.toSql(this.table, this.tableAbbreviation).trimEnd();
        const join           = Joins.toSql(this.joins, oneSpacePrefix).trimEnd();
        const where          = Where.toSql(this.whereClauses, this.rawWhere ?? undefined, this.bindings, oneSpacePrefix).trimEnd();
        const groupBy        = GroupBy.toSql(this.groupBy, oneSpacePrefix).trimEnd();
        const orderBy        = OrderBy.toSql(this.orderByClauses, oneSpacePrefix).trimEnd();
        const offsetLimit    = OffsetLimit.toSql(this.offsetLimit ?? {}, oneSpacePrefix).trimEnd();

        // Construct the SQL query
        let sql = `${selectColumns} ${fromTable}`;
        sql += join;
        sql += where
        sql += groupBy;
        sql += orderBy;
        sql += offsetLimit;

        return sql.trimEnd()
    }

    /**
     * Builds an INSERT query.
     *
     * @returns {string} The SQL string for the INSERT query.
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
     * Builds an UPDATE query.
     *
     * @returns {string} The SQL string for the UPDATE query.
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
     * Builds a DELETE query.
     *
     * @returns {string} The SQL string for the DELETE query.
     */
    buildDelete(): string {
        
        // Construct the components of the SQL query
        const oneSpacePrefix = ' ';
        const deleteFrom     = DeleteFrom.toSql(this.table);
        const where          = Where.toSql(this.whereClauses, this.rawWhere ?? undefined, this.bindings, oneSpacePrefix).trimEnd();
        
        // Construct the SQL query
        let sql = deleteFrom;
        sql += where
        
        return sql.trimEnd()

    }

    /**
     * Converts the current SQL expression to a SQL query string.
     * 
     * This method builds and returns the SQL query string based on the current state
     * of the SqlExpression instance, using the selected build type and configured
     * query components such as the columns, table, joins, where clauses, and more.
     * 
     * @returns {string} The SQL query string representation of the current expression.
     */
    toSql(): string {
        return this.buildSelect();
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
        this.columns.push(column);
        return this
    }

    getColumns(): TColumnOption[] {
        return this.columns
    }

    setDistinctColumns(columns: TColumnOption[]): this {
        console.log('[SqlExpression] setDistinctColumns', columns);
        this.distinctColumns = columns;
        return this   
    }

    getDistinctColumns(): TColumnOption[] {
        return this.distinctColumns || []
    }

    // Where Clause Methods
    setWhere(where: TWhereClause[]): this {
        this.whereClauses = where;
        return this;
    }

    addWhere(where: TWhereClause): this {
        this.whereClauses.push(where);
        return this
    }

    where(column: string, operator: TOperator, value: TWhereClauseValue | TWhereClauseValue[] = null, logicalOperator: TLogicalOperator = 'and'): this {
        this.whereClauses.push({ column, operator, value, logicalOperator, tableName: this.table });
        return this;
    }

    whereRaw(sql: string, bindings: unknown): this {
        this.rawWhere = { sql, bindings };
        return this
    }

    getWhereClauses(): TWhereClause[] {
        return this.whereClauses
    }

    getWhere(): TWhereClause[] {
        return this.whereClauses
    }

    getRawWhere(): RawWhere | null {
        return this.rawWhere
    }

    setWhereClauses(whereClauses: TWhereClause[]) {
        this.whereClauses = whereClauses
        return this
    }

    setRawWhere(where: RawWhere | null): this {
        this.rawWhere = where;
        return this
    }

    getWhereColumnTypes(): Record<string, string> {
        return this.whereColumnTypes
    }

    setWhereColumnTypes(whereColumnTypes: Record<string, string>) {
        this.whereColumnTypes = whereColumnTypes
        return this
    }

    // Join Methods
    setJoins(joins: TJoin[] | TJoin): this {
        this.joins = Array.isArray(joins) ? joins : [joins];
        return this        
    }

    join(options: TJoin): this {
        this.joins.push(options);
        return this
    }

    getJoins(): TJoin[] {
        return this.joins
    }

    // With Methods
    setWiths(withs: TWith[] | TWith): this {
        this.withs = Array.isArray(withs) ? withs : [withs];
        return this
    }

    with(options: TWith): this {
        this.withs.push(options)
        return this
    }

    getWiths(): TWith[] {
        return this.withs
    }

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
        return this.orderByClauses
    }

    setOrderByClauses(orderByClauses: TOrderBy[]) {
        this.orderByClauses = orderByClauses
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

    // Insert/Update Methods
    setInsert(documents: object | object[]): this {
        documents = Array.isArray(documents) ? documents : [documents]
        this.inserts = documents
        this.buildType = 'insert'
        return this
    }

    getInserts(): NullableObjectOrArray {
        return this.inserts
    }

    getInsert(): NullableObjectOrArray {
        return this.inserts
    }

    setUpdate(documents: object | object[]): this {
        documents = Array.isArray(documents) ? documents : [documents]
        this.updates = documents
        this.buildType = 'update'
        return this
    }

    getUpdates(): NullableObjectOrArray {
        return this.updates
    }

    getUpdate(): NullableObjectOrArray {
        return this.updates
    }

    setUpdates(updates: NullableObjectOrArray) {
        this.updates = updates
        return this
    }

    // Select Methods
    setSelect(): this {
        this.buildType = 'select';
        return this;
    }

    setDelete(): this {
        this.buildType = 'delete';
        return this;
    }

    setSelectRaw(sql: string, bindings: unknown): this {
        this.buildType = 'select';
        this.rawSelect = { sql, bindings };
        return this
    }

    getRawSelect(): RawSelect | null {
        return this.rawSelect
    }

    // Binding Methods
    setBindings(bindings: BindingsHelper): this {
        this.bindings = bindings;
        return this
    }

    addBinding(column: string, binding: unknown): this {
        this.bindings.addBinding(column, binding);
        return this
    }

    getBindings(): BindingsHelper {
        return this.bindings
    }

    getBindingValues(): unknown[] {
        return this.bindings.getValues();
    }

    getBindingTypes(): (number | undefined)[] {
        return this.bindings.getTypes()
    }

    // Group By Methods
    getGroupBy(): TGroupBy[] | null {
        return this.groupBy
    }

    setGroupBy(columns: TGroupBy[]): this {
        this.groupBy = columns
        return this
    }

    // Utility Methods
    protected validateArrayObjects(objects: object[], message = 'Expected an array of objects') {
        const schema = z.array(z.object({}));

        if(!schema.safeParse(objects).success) {
            throw new ExpressionException(message);
        }
    }

}

export default SqlExpression