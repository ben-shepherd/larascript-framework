import BaseExpression, { NullableObjectOrArray, RawWhere } from "@src/core/domains/eloquent/base/BaseExpression";
import ExpressionException from "@src/core/domains/eloquent/exceptions/ExpressionException";
import { TColumnOption, TJoin, TLogicalOperator, TOperator, TWhereClause, TWhereClauseValue, TWith } from "@src/core/domains/eloquent/interfaces/IEloquent";
import BindingsHelper from "@src/core/domains/postgres/builder/BindingsHelper";
import DeleteFrom from "@src/core/domains/postgres/builder/ExpressionBuilder/Clauses/DeleteFrom";
import FromTable from "@src/core/domains/postgres/builder/ExpressionBuilder/Clauses/FromTable";
import GroupBy from "@src/core/domains/postgres/builder/ExpressionBuilder/Clauses/GroupBy";
import Insert from "@src/core/domains/postgres/builder/ExpressionBuilder/Clauses/Insert";
import Joins from "@src/core/domains/postgres/builder/ExpressionBuilder/Clauses/Joins";
import OffsetLimit from "@src/core/domains/postgres/builder/ExpressionBuilder/Clauses/OffsetLimit";
import OrderBy from "@src/core/domains/postgres/builder/ExpressionBuilder/Clauses/OrderBy";
import SelectColumns from "@src/core/domains/postgres/builder/ExpressionBuilder/Clauses/SelectColumns";
import Update from "@src/core/domains/postgres/builder/ExpressionBuilder/Clauses/Update";
import Where from "@src/core/domains/postgres/builder/ExpressionBuilder/Clauses/Where";
import { z } from "zod";

type SqlRaw = { sql: string, bindings: unknown }

class SqlExpression extends BaseExpression<BindingsHelper> {
    
    bindingsUtility: BindingsHelper = new BindingsHelper();

    protected rawSelect: SqlRaw | null = null;
    
    protected rawWhere: SqlRaw | null = null;

    /**
     * Sets the default values for the expression properties. 
     */
    protected setDefaults(): void {
        super.setDefaults({
            ...super.getDefaults(),
            bindings: new BindingsHelper()
        })
    }

    // Static Utility Methods
    public static readonly formatColumnWithQuotes = (column: string): string => {
        if(column === '*') {
            return column
        }
        if(!column.startsWith('"')) {
            column = `"${column}`
        }
        if(!column.endsWith('"')){
            column = `${column}"`
        }
        return column
    };

    public static readonly formatTableNameWithQuotes = (tableName: string): string => {
        if(!tableName.startsWith('"')) {
            tableName = `"${tableName}`
        }
        if(!tableName.endsWith('"')){
            tableName = `${tableName}"`
        }
        return tableName
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
        const where          = Where.toSql(this.whereClauses, this.rawWhere, this.bindingsUtility, oneSpacePrefix).trimEnd();
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

        return Insert.toSql(this.table, insertsArray, this.bindingsUtility);
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

        return Update.toSql(this.table, updatesArray, this.whereClauses, this.bindingsUtility);
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
        const where          = Where.toSql(this.whereClauses, this.rawWhere ?? null, this.bindingsUtility, oneSpacePrefix).trimEnd();
        
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

    // Where Clause Methods
    setWhere(where: TWhereClause[]): this {
        this.whereClauses = where;
        return this;
    }

    addWhere(where: TWhereClause): this {
        if(!this.whereClauses) this.whereClauses = [];
        this.whereClauses.push(where)
        return this
    }

    where(column: string, operator: TOperator, value: TWhereClauseValue | TWhereClauseValue[] = null, logicalOperator: TLogicalOperator = 'and'): this {
        if (!this.whereClauses) this.whereClauses = [];
        this.whereClauses.push({ column, operator, value, logicalOperator, tableName: this.table });
        return this;
    }

    whereRaw<T = unknown>(value: T, bindings: unknown): this {
        this.rawWhere = { sql: value, bindings } as unknown as SqlRaw;
        return this
    }

    getWhereClauses(): TWhereClause[] {
        return this.whereClauses ?? []
    }

    getWhere(): TWhereClause[] {
        return this.whereClauses ?? []
    }

    getRawWhere<T = SqlRaw>(): T | null {
        return this.rawWhere as T | null
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
        return this.whereColumnTypes ?? {}
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
        if (!this.joins) this.joins = [];
        this.joins.push(options);
        return this
    }

    getJoins(): TJoin[] {
        return this.joins ?? []
    }

    // With Methods
    setWiths(withs: TWith[] | TWith): this {
        this.withs = Array.isArray(withs) ? withs : [withs];
        return this
    }

    with(options: TWith): this {
        if (!this.withs) this.withs = [];
        this.withs.push(options);
        return this
    }

    getWiths(): TWith[] {
        return this.withs ?? []
    }

    // Insert/Update Methods
    setInsert(documents: object | object[]): this {
        documents = Array.isArray(documents) ? documents : [documents]
        this.inserts = documents
        this.buildType = 'insert'
        return this
    }

    getInserts(): NullableObjectOrArray {
        return this.inserts ?? []
    }

    getInsert(): NullableObjectOrArray {
        return this.inserts ?? []
    }

    setUpdate(documents: object | object[]): this {
        documents = Array.isArray(documents) ? documents : [documents]
        this.updates = documents
        this.buildType = 'update'
        return this
    }

    getUpdates(): NullableObjectOrArray {
        return this.updates ?? []
    }

    getUpdate(): NullableObjectOrArray {
        return this.updates ?? []
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

    setSelectRaw<RawSelect = string>(value: RawSelect, bindings: unknown): this {
        this.buildType = 'select';
        this.rawSelect = { sql: value, bindings } as SqlRaw;
        return this
    }

    getRawSelect<T = SqlRaw>(): T | null {
        return this.rawSelect as T | null
    }

    // Binding Methods
    setBindings(bindings: BindingsHelper): this {
        this.bindingsUtility = bindings;
        return this
    }

    addBinding(column: string, binding: unknown): this {
        this.bindingsUtility.addBinding(column, binding);
        return this
    }

    getBindings(): BindingsHelper {
        return this.bindingsUtility
    }

    getBindingValues(): unknown[] {
        return this.bindingsUtility.getValues();
    }

    getBindingTypes(): (number | undefined)[] {
        return this.bindingsUtility.getTypes()
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