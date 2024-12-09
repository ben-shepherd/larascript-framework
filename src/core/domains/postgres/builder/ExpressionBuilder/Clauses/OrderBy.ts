import { TOrderBy } from "@src/core/domains/eloquent/interfaces/IEloquent";

import SqlExpression from "../SqlExpression";

class OrderBy {

    static toSql(orders: TOrderBy[] | null = null, prefix: string = ''): string {

        if(!orders) return '';
        
        if(orders.length === 0) return '';

        let sql = `${prefix}ORDER BY `

        sql += orders.map((order) => `${this.columnToSql(order)} ${this.directionToSql(order)}`).join(', ')

        return sql;
    }

    static columnToSql({ column }: TOrderBy): string {
        return SqlExpression.prepareColumnOptions({column}).column
    }

    static directionToSql({ direction }: TOrderBy): string {
        return direction.toUpperCase()
    }

}

export default OrderBy