import { TColumnOption } from "@src/core/domains/eloquent/interfaces/IEloquent";

class Project {

    /**
     * Builds the $project stage of the aggregation pipeline
     * @param columns - The columns to project
     * @returns The $project pipeline stage or null if no columns are specified
     */
    static getPipeline(columns: TColumnOption[] | null): object | null {
        if(!columns?.length) return null;

        if(columns.length === 1 && columns[0].column === '*') {
            return null
        }
        
        const project = {};

        columns.forEach(column => {
            if(column.column) {
                project[column.column] = 1
            }
        })

        return { $project: project };
    }

}

export default Project