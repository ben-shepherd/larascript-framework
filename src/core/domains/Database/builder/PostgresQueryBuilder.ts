export type OrderArray = Record<string, 'ASC' | 'DESC'>[]

export type SelectOptions = {
    tableName: string
    fields?: string[]
    filter?: object
    order?: OrderArray
    limit?: number
}

class PostgresQueryBuilder
{
    /**
     * Build select
     * @param fields 
     * @param tableName 
     * @param filter 
     * @returns 
     */
    select({ fields, tableName, filter = {}, order = [], limit = undefined }: SelectOptions): string
    {
        let queryStr = `SELECT ${this.selectColumnsClause(fields)} FROM "${tableName}"`;

        if(Object.keys(filter ?? {}).length > 0)
        {
            queryStr += ` WHERE ${this.whereClause(filter)}`;
        }

        if(order.length > 0)
        {
            queryStr += ` ORDER BY ${this.orderByClause(order)}`
        }

        if(limit)
        {
            queryStr += ` LIMIT ${limit}`
        }

        return queryStr;
    }

    /**
     * Build select columns
     * @param fields 
     * @returns 
     */
    selectColumnsClause(fields: string[] | null = null): string
    {
        return fields ? fields.join(', ') : '*';
    }

    /**
     * Build order by
     * @param orders 
     * @returns 
     */
    orderByClause(orders: Record<string, 'ASC' | 'DESC'>[] = []): string
    {
        let queryStr = '';

        orders.forEach((order) => {
            Object.keys(order).forEach((key) => {
                queryStr += `${key} ${order[key]}, `
            })
        })

        return queryStr;
    }

    /**
     * Build where clause
     * @param filter 
     * @returns 
     */
    whereClause(filter: object = {}): string
    {
        return Object.keys(filter).map((key) => {
            const value = filter[key];

            if(value === null) {
                return `"${key}" IS NULL`;
            }
            
            return `"${key}" = :${key}`
        }).join(' AND ');
    }
}

export default PostgresQueryBuilder