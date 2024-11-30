import { TJoin } from "@src/core/domains/eloquent/interfaces/IEloquent";

class Joins {

    /**
     * Converts an array of joins to a SQL string that can be used for a query.
     * 
     * @param joins - An array of joins to convert to a SQL string.
     * @returns The SQL string for the joins.
     */
    static toSql(joins: TJoin[], prefix: string = ''): string {

        let sql = `${prefix}`;

        for(const join of joins) {
            if(join.type === 'inner') {
                sql += this.innerJoin(join.table, join.leftColumn, join.rightColumn)
            }
            else if(join.type === 'left') {
                sql += this.leftJoin(join.table, join.leftColumn, join.rightColumn)
            }
            else if(join.type === 'right') {
                sql += this.rightJoin(join.table, join.leftColumn, join.rightColumn)
            }
            else if(join.type === 'full') {
                sql += this.fullJoin(join.table, join.leftColumn, join.rightColumn)
            }
            else if(join.type === 'cross') {
                sql += this.crossJoin(join.table)
            }
        }

        return sql
    }

    static formatTable(table: string, abbreviation?: string | null) {
        return `${table}${abbreviation ? `${abbreviation} ` : ''}`;
    }

    static innerJoin(table: string, leftColumn: string, rightColumn: string) {
        return `JOIN ${this.formatTable(table)} ON ${leftColumn} = ${rightColumn}`
    }

    static leftJoin(table: string, leftColumn: string, rightColumn: string) {
        return `LEFT JOIN ${this.formatTable(table)} ON ${leftColumn} = ${rightColumn}`
    }

    static rightJoin(table: string, leftColumn: string, rightColumn: string) {
        return `RIGHT JOIN ${this.formatTable(table)} ON ${leftColumn} = ${rightColumn}`
    }

    static fullJoin(table: string, leftColumn: string, rightColumn: string) {
        return `FULL JOIN ${this.formatTable(table)} ON ${leftColumn} = ${rightColumn}`
    }

    static crossJoin(table: string) {
        return `CROSS JOIN ${this.formatTable(table)}`
    }

}

export default Joins