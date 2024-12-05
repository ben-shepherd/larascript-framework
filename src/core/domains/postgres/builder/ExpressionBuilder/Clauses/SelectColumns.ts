
import { TColumn } from "@src/core/domains/eloquent/interfaces/IEloquent";

import SqlExpression from "../SqlExpression";

type RawSelect = { sql: string, bindings: unknown };

class SelectColumns {

    /**
     * Converts an array of columns to a SQL string that can be used for a SELECT query.
     *
     * Example: SELECT *
     * Example: SELECT DISTINCT ON (column1, column2) *
     * @param {string[]} columnOptions - An array of columns to convert to a SQL string.
     * @param {string[] | null} distinctColumnsOptions - An array of columns to append for the DISTINCT ON clause.
     * @returns {string} The SQL string for the SELECT query.
     */
    public static toSql(columnOptions: TColumn[], distinctColumnsOptions: TColumn[] | null = null, rawSelect?: RawSelect): string {
        let sql = 'SELECT ';

        if(rawSelect) {
            sql += rawSelect.sql
            return sql
        }

        const distinctColumnsArray = this.prepareDistinctColumns(distinctColumnsOptions);
        const columnsArray = this.prepareColumns(columnOptions);

        sql = this.distinctColumns(sql, distinctColumnsArray);
        sql = this.selectColumns(sql, columnsArray);
        return sql;
    }

    protected static prepareDistinctColumns(distinctColumns: TColumn[] | null): TColumn[] {
        return SqlExpression.formatColumn<TColumn[]>(distinctColumns ?? [])
    }


    protected static prepareColumns(options: TColumn[] | null): string[] {
        if(options === null || options.length === 0) {
            options = [{column: '*'}]
        }

        // Format the columns
        options = SqlExpression.formatColumn(options);

        // Add table name and alias
        return options.map(option => {
            let columnString = option.column

            // If the column has a table name, add it
            if(option.tableName) {
                columnString = `${option.tableName}.${option.column}`;
            }

            // If the column has an alias, add it
            if(option.as) {
                columnString += ` AS ${SqlExpression.formatColumnWithQuotes(option.as)}`;
            }
            
            return columnString
        });
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
    static selectColumns(sql: string, columns: string[]): string {

        const firstItemIsAll = columns.length === 1 && columns[0] === '*';
        const isAll = columns.length === 0 || firstItemIsAll

        if(isAll) {
            sql += '*';
            return sql
        }

        sql += `${columns.join(', ')}`;
        return sql
    }

}

export default SelectColumns