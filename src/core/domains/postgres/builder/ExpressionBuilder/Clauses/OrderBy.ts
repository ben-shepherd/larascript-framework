import { TOrderBy } from "@src/core/domains/eloquent/interfaces/IQueryBuilder";

class OrderBy {

    static toSql(orders: TOrderBy[] = [], prefix: string = ''): string {

        if(orders.length === 0) return '';

        let sql = `${prefix}ORDER BY `

        sql += orders.map((order) => `${this.columnToSql(order)} ${this.directionToSql(order)}`).join(', ')

        return sql;
    }

    static columnToSql({ column }: TOrderBy): string {
        return `${column}`   
    }

    static directionToSql({ direction }: TOrderBy): string {
        return direction.toUpperCase()
    }

}

export default OrderBy