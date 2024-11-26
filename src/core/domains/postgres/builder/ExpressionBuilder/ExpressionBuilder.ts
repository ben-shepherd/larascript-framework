import { TOrderBy, TWhereClause } from "../../interfaces/IPostgresQueryBuilder";


class ExpressionBuilder {

    protected table: string         = '';

    protected columns: string[]     = [];

    protected bindings: unknown[]   = [];

    protected where: TWhereClause[] = [];

    protected orderBy: TOrderBy[]   = []

    /**
     * Todo: move each string builder to it's own file
     * e.g. SelectFrom.build(columns, table)
     *      WhereClause.build(where)
    *       OrderBy.build(orderBy)
    *       Join.build()
    *       Offset.build(1,5)
     */
    protected build()
    {
        let sql = '';

        // Build select query
        sql += `SELECT ${this.columns.join(', ')} FROM ${this.table}`

        // Build where clause
        if(this.where.length > 0) {
            sql += ` WHERE ${this.where.join(' AND ')}`
        }

        // Build order by clause
        if(this.orderBy.length > 0) {
            sql += ` ORDER BY ${this.orderBy.join(', ')}`
        }
        
        return sql
    }

    setTable(table: string): this {
        this.table = table;
        return this;
    }

    setColumns(columns: string[]): this {
        this.columns = columns;
        return this;
    }

    setBindings(bindings: unknown[]): this {
        this.bindings = bindings;
        return this;
    }

    setWhere(where: TWhereClause[]): this {
        this.where = where;
        return this;
    }

    setOrderBy(orderBy: TOrderBy[]): this {
        this.orderBy = orderBy;
        return this;
    }

    toSql(): string {
        return '';
    }
    
}

export default ExpressionBuilder
