/**
 * Order array type
 */
export type OrderArray = Record<string, 'ASC' | 'DESC'>[]

/**
 * Options for select query
 */
export type SelectOptions = {

    /**
     * Table name
     */
    tableName: string

    /**
     * Fields to select
     */
    fields?: string[]

    /**
     * Filter for query
     */
    filter?: object;

    /**
     * Allow partial search
     */
    allowPartialSearch?: boolean

    /**
     * Order by
     */
    order?: OrderArray

    /**
     * Limit
     */
    limit?: number

    /**
     * Skip
     */
    skip?: number
}

/**
 * Query builder for Postgres
 */
class PostgresQueryBuilder {

    /**
     * Build select query
     * @param options Select options
     * @returns Query string
     */
    select({ fields, tableName, filter = {}, order = [], limit = undefined, skip = undefined, allowPartialSearch = false }: SelectOptions): string {
        let queryStr = `SELECT ${this.selectColumnsClause(fields)} FROM "${tableName}"`;

        if(Object.keys(filter ?? {}).length > 0) {
            queryStr += ` WHERE ${this.whereClause(filter, { allowPartialSearch })}` ;
        }

        if(order.length > 0) {
            queryStr += ` ORDER BY ${this.orderByClause(order)}`
        }

        if(limit && !skip) {
            queryStr += ` LIMIT ${limit}`
        }

        if(skip && limit) {
            queryStr += ` OFFSET ${skip} LIMIT ${limit}`
        }

        return queryStr;
    }

    /**
     * Build select columns clause
     * @param fields Fields to select
     * @returns Select columns clause
     */
    selectColumnsClause(fields: string[] | null = null): string {
        return fields ? fields.join(', ') : '*';
    }

    /**
     * Build order by clause
     * @param orders Orders
     * @returns Order by clause
     */
    orderByClause(orders: Record<string, 'ASC' | 'DESC'>[] = []): string {
        return orders.map((order) => {
            return Object.keys(order).map((key) => {
                return `"${key}" ${order[key]}`
            }).join(', ')
        }).join(', ');

    }

    /**
     * Build where clause
     * @param filter Filter
     * @returns Where clause
     */
    whereClause(filter: object = {}, { allowPartialSearch = false } = {}): string {
        return Object.keys(filter).map((key) => {
            const value = filter[key];

            if(value === null) {
                return `"${key}" IS NULL`;
            }

            if(allowPartialSearch && typeof value === 'string' && (value.startsWith('%') || value.endsWith('%'))) {
                return `"${key}" LIKE :${key}`
            }
            
            return `"${key}" = :${key}`
        }).join(' AND ');
    }

}

/**
 * Default export
 */
export default PostgresQueryBuilder
