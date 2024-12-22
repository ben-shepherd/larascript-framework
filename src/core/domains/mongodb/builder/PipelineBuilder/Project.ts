import { TColumnOption } from "@src/core/domains/eloquent/interfaces/IEloquent";

class Project {

    static getPipeline(columns: TColumnOption[] | null): object | null {
        if(!columns) return null;
        
        const columnsArray = columns.filter(column => column).map(column => column.column) as string[]

        return { $project: columnsArray.map(column => ({ [column]: 1 })) };
    }

}

export default Project