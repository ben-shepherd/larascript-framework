import { TColumnOption } from "@src/core/domains/eloquent/interfaces/IEloquent";

import { normalizeColumn } from "@src/core/domains/mongodb/utils/normalizeColumn";

class Project {

    /**
     * Builds the $project stage of the aggregation pipeline
     * @param columns - The columns to project
     * @returns The $project pipeline stage or null if no columns are specified
     */
    static getPipeline(columns: TColumnOption[] | null): object | null {
        if (!columns?.length) return null;

        if (columns.length === 1 && columns[0].column === '*') {
            return null
        }

        const project = {};

        columns.forEach(columnObject => {
            if (columnObject.column) {
                columnObject.column = normalizeColumn(columnObject.column)
                project[columnObject.column] = 1
            }
        })

        return { $project: project };
    }

    static

}

export default Project