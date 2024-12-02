import ExpressionException from "@src/core/domains/eloquent/exceptions/ExpressionException";
import { LogicalOperators, TLogicalOperator, TWhereClause, TWhereClauseValue } from "@src/core/domains/eloquent/interfaces/IEloquent";

import BindingsHelper from "../../BindingsHelper";
import SqlExpression from "../SqlExpression";

type SqlWhereClause = {
    column: string;
    operator: string;
    value?: TWhereClauseValue;
    logicalOperator?: TLogicalOperator
    appendValue?: boolean;
    appendValueNoBind?: boolean
}

type RawWhere = {
    sql: string;
    bindings: unknown;
}

class Where {

    /**
     * Creates a new instance of the WhereClause class.
     * @param filters 
     */
    constructor(
        // eslint-disable-next-line no-unused-vars
        protected filters: TWhereClause[] | undefined,
        // eslint-disable-next-line no-unused-vars
        protected rawWhere: RawWhere | undefined,
        // eslint-disable-next-line no-unused-vars
        protected bindings: BindingsHelper = new BindingsHelper()
    ) {}

    /**
     * Converts an array of where clauses and a raw where clause into a SQL string
     * that can be used for a WHERE clause.
     *
     * @param {TWhereClause[]} filters - The array of where clauses to convert.
     * @param {RawWhere | undefined} rawWhere - The raw SQL and bindings to use for the where clause.
     * @param {BindingsHelper} [bindings] - An instance of the BindingsHelper class for managing bindings.
     * @param {string} [prefix] - An optional prefix to prepend to the SQL string.
     * @returns {string} The SQL string for the WHERE clause.
     */
    static toSql(filters: TWhereClause[] | undefined, rawWhere: RawWhere | undefined, bindings: BindingsHelper = new BindingsHelper(), prefix: string = ''): string {
        return new Where(filters, rawWhere, bindings).build(prefix)
    }

    /**
     * Builds a SQL string for a WHERE clause from the given filters and raw where clause.
     * 
     * If a raw where clause is provided, it is used to generate the SQL string.
     * If filters are provided, they are used to generate the SQL string.
     * If no filters are provided, an exception is thrown.
     * If the filters array is empty, an empty string is returned.
     * 
     * @param {string} [prefix] - An optional prefix to prepend to the SQL string.
     * @returns {string} The SQL string for the WHERE clause.
     */
    build(prefix: string = ''): string {

        if(this.rawWhere) {
            return `${prefix}${this.whereRaw(this.rawWhere)}`
        }

        if(!this.filters) {
            throw new ExpressionException('No filters provided')
        }

        if(this.filters.length === 0) {
            return ''
        }

        return `${prefix}${this.where(this.filters)}`
    }

    /**
     * Converts an array of where clauses to a SQL string for use in a WHERE clause.
     *
     * Each where clause is parsed into its SQL representation, with the column, 
     * operator, and value (if required) being appended to the SQL string. Logical 
     * operators (AND, OR) are used to concatenate multiple clauses. If no logical 
     * operator is explicitly provided, AND is used by default.
     *
     * @param {TWhereClause[]} wheres - An array of where clauses to convert to a SQL string.
     * @returns {string} The generated SQL string for the WHERE clause.
     * 
     * Example: WHERE column LIKE value AND column2 = value
     * Example: WHERE column = value OR column2 >= value
     */
    where(wheres: TWhereClause[]): string {
        let sql = `WHERE `;
        
        for(let i = 0; i < wheres.length; i++) {
            const whereSql = this.convertToSqlWhereClause(wheres[i])

            // Example: column LIKE
            // Example: column =
            sql += `${this.columnToSql(whereSql)} ${this.operatorToSql(whereSql)} `

            // Example: value
            // So far: column LIKE value
            if(whereSql.appendValue !== false) {
                if(whereSql.appendValueNoBind) {
                    sql += whereSql.value
                }
                else {
                    sql += this.valueToBindingPlaceholder(whereSql)
                }
            }

            // Example: AND
            // So far: column LIKE value AND
            if(i < wheres.length - 1) {
                const nextParsed = this.convertToSqlWhereClause(wheres[i + 1]) ?? null

                // If there is a next parsed, append the logical operator (AND, OR)
                if(nextParsed) {
                    sql += this.logicalOperatorToSql(nextParsed) + ' '
                    continue
                }

                // Otherwise, use the default logical operator (AND)
                sql += this.logicalOperatorToSql({...whereSql, logicalOperator: LogicalOperators.AND}) + ' '
            }
        }

        return sql
    }

    /**
     * Converts a raw where clause into a SQL string that can be used for a WHERE clause.
     *
     * @param {RawWhere} rawWhere - The raw where clause containing the SQL string and bindings to use.
     * @returns {string} The SQL string for the WHERE clause.
     */
    whereRaw({sql, bindings }: RawWhere): string {
        this.bindings.addBinding(null, bindings)
        return `WHERE ${sql}`;
    }

    /**
     * Converts the column name from a parsed where clause into its SQL representation.
     *
     * @param {SqlWhereClause} param0 - The parsed where clause containing the column name.
     * @returns {string} The SQL-safe column name wrapped in backticks.
     */
    columnToSql({ column }: SqlWhereClause): string {
        column = SqlExpression.formatColumn(column);
        return `${column}`
    }

    /**
     * Converts the operator from a parsed where clause into its SQL representation.
     *
     * @param {SqlWhereClause} param0 - The parsed where clause containing the operator.
     * @returns {string} The SQL-safe operator.
     */
    operatorToSql({ operator }: SqlWhereClause): string {
        return operator
    }

    /**
     * Converts the value from a parsed where clause into its SQL representation.
     *
     * @param {SqlWhereClause} param0 - The parsed where clause containing the value.
     * @returns {TWhereClauseValue} The SQL-safe value.
     */
    valueToBindingPlaceholder({ column, value }: SqlWhereClause): string {
        return this.bindings.addBinding(column, value).getLastBinding()?.sql as string
    }

    /**
     * Converts the logical operator from a parsed where clause into its SQL representation.
     *
     * Example: AND
     * So far: column LIKE value AND
     * @param {SqlWhereClause} param0 - The parsed where clause containing the logical operator.
     * @returns {string} The SQL-safe logical operator.
     */
    logicalOperatorToSql({ logicalOperator = "and" }: SqlWhereClause): string {
        return ` ${logicalOperator.toUpperCase()}`
    }

    /**
     * Converts a parsed where clause into its SQL representation.
     *
     * This method will parse the operator and value from the parsed where clause and
     * return a new object with the parsed column, operator and value.
     *
     * The value will be converted into a SQL-safe string using the BindingsHelper
     * class to generate a placeholder for the value.
     *
     * @param {TWhereClause} filter - The parsed where clause to convert.
     * @returns {SqlWhereClause} The parsed where clause in its SQL representation.
     */
    convertToSqlWhereClause({ column, ...filter}: TWhereClause): SqlWhereClause {
        const convertedWhere = { column, ...filter} as SqlWhereClause

        if (filter.operator === 'in') {
            convertedWhere.operator = 'IN';
            convertedWhere.value = this.getWhereInValuePlaceholders(convertedWhere);
            convertedWhere.appendValueNoBind = true;
        }
        else if (filter.operator === 'not in') {
            convertedWhere.operator = 'NOT IN';
            convertedWhere.value = this.getWhereInValuePlaceholders(convertedWhere);
            convertedWhere.appendValueNoBind = true;
        }
        else if (filter.operator === 'between') {
            convertedWhere.operator = 'BETWEEN';
        }
        else if (filter.operator === 'not between') {
            convertedWhere.operator = 'NOT BETWEEN';
        }
        else if (filter.operator === 'like') {
            convertedWhere.operator = 'LIKE';
        }
        else if (filter.operator === 'not like') {
            convertedWhere.operator = 'NOT LIKE';
        }
        else if (filter.operator === 'is null') {
            convertedWhere.operator = 'IS NULL';
            convertedWhere.value = undefined;
            convertedWhere.appendValue = false;
        }
        else if (filter.operator === 'is not null') {
            convertedWhere.operator = 'IS NOT NULL';
            convertedWhere.value = undefined;
            convertedWhere.appendValue = false;
        }

        return convertedWhere
    }
 
    /**
     * Converts an array of values into their SQL placeholder representation
     * suitable for an IN clause.
     *
     * @param {SqlWhereClause} whereClause - The parsed where clause to convert.
     * @returns {string} A string containing the SQL placeholder values for the
     * given array of values in the format `(?, ?, ?)`.
     * 
     * Example: `($1, $2, $3)`
     */
    protected getWhereInValuePlaceholders({ column, value }: SqlWhereClause): string {
        const valueArray: Iterable<unknown> = Array.isArray(value) ? value : [value];
        const placeholders: string[] = []
        for(const value of valueArray) {
            placeholders.push(
                this.bindings.addBinding(column, value).getLastBinding()?.sql as string
            );

        }

        return `(${placeholders.join(', ')})`
    }

}

export default Where