import { TJoin, TOffset, TOperator, TOrderBy, TWhereClause, TWhereClauseValue } from "@src/core/domains/eloquent/interfaces/IQueryBuilder";

import BindingsHelper from "../BindingsHelper";
import FromTable from "./Clauses/FromTable";
import Joins from "./Clauses/Joins";
import Offset from "./Clauses/Offset";
import OrderBy from "./Clauses/OrderBy";
import SelectColumns from "./Clauses/SelectColumns";
import Where from "./Clauses/Where";


class SqlExpressionBuilder {

    protected bindings                           = new BindingsHelper();

    protected table: string                      = '';

    protected tableAbbreviation?: string | null  = null

    protected columns: string[]                  = ['*'];

    protected whereClauses: TWhereClause[]       = [];

    protected joins: TJoin[]                     = [];

    protected orderByClauses: TOrderBy[]         = []

    protected offset: TOffset | null             = null;


    /**
     * Builds a SQL query string from the query builder's properties
     *
     * @returns {string} The SQL query string
     */
    protected build() {

        if(this.table.length === 0) {
            throw new Error('Table name is required');
        }

        const oneSpacePrefix = ' ';
        const selectColumns = SelectColumns.toSql(this.columns);
        const fromTable = FromTable.toSql(this.table, this.tableAbbreviation);
        const where =  Where.toSql(this.whereClauses, this.bindings, oneSpacePrefix);
        const join = Joins.toSql(this.joins, oneSpacePrefix);
        const orderBy = OrderBy.toSql(this.orderByClauses, oneSpacePrefix);
        const offset = Offset.toSql(this.offset, oneSpacePrefix);

        let sql = `${selectColumns} ${fromTable}`;
        sql += where
        sql += join;
        sql += orderBy;
        sql += offset;

        /**
         * TODO: Temporary log the SQL query string.
         */
        console.log('[SQL Expression Builder]', {sql, bindings: this.bindings.getValues()});

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

    /**
     * Adds a single binding to the builder.
     * This method wraps the given binding in an array and passes it to the underlying addBindings method.
     * 
     * @param {unknown} binding The value to bind.
     * @returns {this} The query builder instance.
     */
    addBinding(binding: unknown): this {
        this.bindings.addBindings(binding);
        return this
    }

    /**
     * Retrieves the list of values that have been added to the builder as bindings.
     * This can be useful for debugging or logging purposes.
     * @returns {unknown[]} The list of values
     */
    getBindings(): unknown[] {
        return this.bindings.getValues();
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
    where(column: string, operator: TOperator, value: TWhereClauseValue | TWhereClauseValue[]): this {
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
    setOffset(offset: TOffset | null = null): this {
        this.offset = offset;
        return this;
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
     * Builds a SQL query string from the query builder's properties.
     * 
     * @returns {string} The SQL query string
     */
    toSql(): string {
        return this.build();
    }
    
}

export default SqlExpressionBuilder
