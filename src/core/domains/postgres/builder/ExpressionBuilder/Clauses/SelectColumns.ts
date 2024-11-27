
class SelectColumns {

    /**
     * Converts an array of columns to a SQL string that can be used for a SELECT query.
     * 
     * @param columns - An array of columns to convert to a SQL string.
     * @returns The SQL string for the columns.
     */
    public static toSql(columns: string[]): string {
        let sql = 'SELECT ';

        const firstItemIsAll = columns.length === 1 && columns[0] === '*';
        const isAll = columns.length === 0 || firstItemIsAll

        if(isAll) {
            sql += '*';
            return sql
        }

        sql += `${columns.map(column => `\`${column}\``).join(', ')}`;

        return sql;
    }

}

export default SelectColumns