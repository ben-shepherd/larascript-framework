import { TOffset } from "@src/core/domains/eloquent/interfaces/IQueryBuilder";

class Offset {

    /**
     * Converts the offset property from the query builder into its SQL representation.
     *
     * Example: LIMIT 10 OFFSET 10
     *
     * @param {TOffset} offset - The offset property from the query builder.
     * @returns {string} The SQL-safe LIMIT and OFFSET clause.
     */
    static toSql(offset: TOffset | null, prefix: string = ''): string {
        if(!offset) return ''

        const sql = `${prefix}LIMIT ${offset.limit}`

        if(offset.offset) {
            return `${sql} OFFSET ${offset.offset}`
        }

        return sql
    }

}

export default Offset