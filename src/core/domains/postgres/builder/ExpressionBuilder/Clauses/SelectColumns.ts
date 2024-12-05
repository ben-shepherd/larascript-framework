
import { TColumn } from "@src/core/domains/eloquent/interfaces/IEloquent";

import SqlExpression from "../SqlExpression";

type RawSelect = { sql: string, bindings: unknown };

class SelectColumns {

    /**
     * Converts an array of columns to a SQL string that can be used for a SELECT query.
     *
     * Example: SELECT *
     * Example: SELECT DISTINCT ON (column1, column2) *
     * @param {string[]} columns - An array of columns to convert to a SQL string.
     * @param {string[] | null} distinctColumns - An array of columns to append for the DISTINCT ON clause.
     * @returns {string} The SQL string for the SELECT query.
     */
    public static toSql(columns: TColumn[], distinctColumns: TColumn[] | null = null, rawSelect?: RawSelect): string {
        let sql = 'SELECT ';

        if(rawSelect) {
            sql += rawSelect.sql
            return sql
        }

        sql = this.distinctColumns(sql, distinctColumns);
        sql = this.selectColumns(sql, columns);
        return sql;
    }

    /**
     * Appends DISTINCT ON clause to the SQL query.
     * @param {string} sql - The SQL query string to append the DISTINCT ON clause to.
     * @param {string[] | null} distinctColumns - An array of columns to append for the DISTINCT ON clause.
     * @returns {string} The updated SQL query string with the DISTINCT ON clause.
     */
    static distinctColumns(sql: string, distinctColumns: TColumn[] | null): string {
        const distinctColumnsArray = SqlExpression.formatColumn<TColumn[]>(distinctColumns ?? [])

        if(distinctColumnsArray.length > 0) {
            sql += `DISTINCT ON (${distinctColumnsArray.map(column => column.column).join(', ')}) `;
        }

        return sql
    }

    /**
     * Appends the columns to the SQL query string.
     * @param {string} sql - The SQL query string to append the columns to.
     * @param {string[]} columns - An array of columns to append.
     * @returns {string} The updated SQL query string with the columns appended.
     */
    static selectColumns(sql: string, columns: TColumn[]): string {
        if(columns.length === 0) {
            columns = [{column: '*'}]
        }
        
        const firstItemIsAll = columns.length === 1 && columns[0].column === '*';
        const isAll = columns.length === 0 || firstItemIsAll

        if(isAll) {
            sql += '*';
            return sql
        }

        columns = SqlExpression.formatColumn(columns);
        const columnStrings = columns.map(column => {
            if(column.tableName) {
                return `${column.tableName}.${column.column}`;
            }
            return column
        });

        sql += `${columnStrings.join(', ')}`;
        return sql
    }

}

export default SelectColumns