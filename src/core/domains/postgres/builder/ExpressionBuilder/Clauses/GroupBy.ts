import { TGroupBy } from "@src/core/domains/eloquent/interfaces/IEloquent";

import SqlExpression from "../SqlExpression";

class GroupBy {

    static toSql(groupBy: TGroupBy[] | null, prefix: string = ''): string {

        if(!groupBy || groupBy.length === 0) return '';

        let sql = `${prefix}GROUP BY `

        const columnsArray = groupBy.map((item) => {
            let result = '';

            if(!item.column) {
                item.column = '*';
            }

            if(item.column !== '*')  {
                item.column = SqlExpression.formatColumnWithQuotes(item.column)
            }

            if(item.tableName) {
                result += item.tableName + '.';
            }

            return result + SqlExpression.formatColumnWithQuotes(item.column);
        })

        sql += columnsArray.join(', ')

        return sql;
    }

}

export default GroupBy