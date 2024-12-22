import { TOrderBy } from "@src/core/domains/eloquent/interfaces/IEloquent";


class Sort {

    /**
     * Gets the pipeline for the given order by clauses.
     * 
     * @param orderByClauses The order by clauses to generate the pipeline for.
     * @returns The generated pipeline or null if no order by clauses are given.
     */
    static getPipeline(orderByClauses: TOrderBy[] | null): object | null {
        if(!orderByClauses) return null;

        const pipeline: object[] = [];

        orderByClauses.forEach(orderByClause => {
            pipeline.push({ [orderByClause.column]: orderByClause.direction })
        })  

        return pipeline
    }

}

export default Sort