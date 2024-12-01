import { TLogicalOperator, TWhereClause, TWhereClauseValue } from "@src/core/domains/eloquent/interfaces/IEloquent";

import BindingsHelper from "../../BindingsHelper";
import SqlExpression from "../SqlExpression";

type ParsedWhereClause = {
    column: string;
    operator: string;
    value?: TWhereClauseValue;
    logicalOperator?: TLogicalOperator
}

class Where {

    /**
     * Creates a new instance of the WhereClause class.
     * @param filters 
     */
    constructor(
        // eslint-disable-next-line no-unused-vars
        protected filters: TWhereClause[],
        // eslint-disable-next-line no-unused-vars
        protected bindings: BindingsHelper = new BindingsHelper()
    ) {}

    /**
     * Converts an array of filters to a WHERE clause SQL string.
     *
     * Loops through the filters array and appends the SQL string for each filter.
     * The SQL string is formed by appending the column name, operator, value and logical operator.
     * The logical operator is only appended if it's not the last filter in the array.
     *
     * @param filters - An array of filters to be converted to a WHERE clause SQL string.
     * @param bindings - An instance of the BindingsHelper class.
     * @returns The WHERE clause SQL string.
     */
    public static toSql(filters: TWhereClause[], bindings: BindingsHelper = new BindingsHelper(), prefix: string = ''): string {
        return new Where(filters, bindings).build(prefix)
    }

    /**
     * Builds a SELECT query string from the query builder's properties.
     */
    public build(prefix: string = ''): string {

        if(this.filters.length === 0) {
            return ''
        }

        let sql = `${prefix}WHERE `;

        for(let i = 0; i < this.filters.length; i++) {
            const parsed = this.parse(this.filters[i])

            // Example: column LIKE
            sql += `${this.columnToSql(parsed)} ${this.operatorToSql(parsed)} `

            // Example: value
            // So far: column LIKE value
            if(this.shouldAppendValue(parsed)) {
                sql += this.valueToSql(parsed)
            }

            // Example: AND
            // So far: column LIKE value AND
            if(i < this.filters.length - 1) {
                sql += this.logicalOperatorToSql(parsed) + ' '
            }
        }

        return sql
    }

    /**
     * Converts the column name from a parsed where clause into its SQL representation.
     *
     * @param {ParsedWhereClause} param0 - The parsed where clause containing the column name.
     * @returns {string} The SQL-safe column name wrapped in backticks.
     */
    public columnToSql({ column }: ParsedWhereClause): string {
        column = SqlExpression.formatColumn(column);
        return `${column}`
    }

    /**
     * Converts the operator from a parsed where clause into its SQL representation.
     *
     * @param {ParsedWhereClause} param0 - The parsed where clause containing the operator.
     * @returns {string} The SQL-safe operator.
     */
    public operatorToSql({ operator }: ParsedWhereClause): string {
        return operator
    }

    /**
     * Converts the value from a parsed where clause into its SQL representation.
     *
     * @param {ParsedWhereClause} param0 - The parsed where clause containing the value.
     * @returns {TWhereClauseValue} The SQL-safe value.
     */
    public valueToSql({ value }: ParsedWhereClause): TWhereClauseValue {
        return this.bindings.addBindings(value).getLastBinding()?.sql as string
    }

    /**
     * Converts the logical operator from a parsed where clause into its SQL representation.
     *
     * Example: AND
     * So far: column LIKE value AND
     * @param {ParsedWhereClause} param0 - The parsed where clause containing the logical operator.
     * @returns {string} The SQL-safe logical operator.
     */
    public logicalOperatorToSql({ logicalOperator = "and" }: ParsedWhereClause): string {
        return ` ${logicalOperator.toUpperCase()}`
    }

    /**
     * Checks if the value in a parsed where clause should be appended to the SQL query.
     *
     * The value should be appended if the operator is not 'is null' or 'is not null'.
     *
     * @param {ParsedWhereClause} param0 - The parsed where clause containing the operator.
     * @returns {boolean} True if the value should be appended, false otherwise.
     */
    public shouldAppendValue({ operator }: ParsedWhereClause): boolean {
        return operator !== 'is null' && operator !== 'is not null'
    }

    /**
     * Parses and converts a filter's operator to its corresponding SQL operator.
     * 
     * This function takes a TWhereClause filter and returns a ParsedWhereClause
     * with the operator converted to the equivalent SQL operator. Supported 
     * operators include 'in', 'not in', 'between', 'not between', 'like', 'not like',
     * 'is null', and 'is not null'.
     *
     * @param {TWhereClause} filter - The filter containing the operator to be parsed.
     * @returns {ParsedWhereClause} - The filter with the operator converted to SQL syntax.
     */
    public parse(filter: TWhereClause): ParsedWhereClause {
        const parsedFilter = {...filter} as ParsedWhereClause
        const valueAsArray = Array.isArray(filter.value) ? filter.value : [filter.value]

        if (filter.operator === 'in') {
            parsedFilter.operator = 'IN';
            parsedFilter.value = `(${this.bindings.valuesToPlaceholderSqlArray(valueAsArray).join(', ')})`;
        }
        else if (filter.operator === 'not in') {
            parsedFilter.operator = 'NOT IN';
        }
        else if (filter.operator === 'between') {
            parsedFilter.operator = 'BETWEEN';
        }
        else if (filter.operator === 'not between') {
            parsedFilter.operator = 'NOT BETWEEN';
        }
        else if (filter.operator === 'like') {
            parsedFilter.operator = 'LIKE';
        }
        else if (filter.operator === 'not like') {
            parsedFilter.operator = 'NOT LIKE';
        }
        else if (filter.operator === 'is null') {
            parsedFilter.operator = 'IS NULL';
            parsedFilter.value = undefined;
        }
        else if (filter.operator === 'is not null') {
            parsedFilter.operator = 'IS NOT NULL';
            parsedFilter.value = undefined;
        }

        return filter as ParsedWhereClause
    }


}

export default Where