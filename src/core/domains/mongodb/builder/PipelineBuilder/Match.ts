import { TWhereClause } from "@src/core/domains/eloquent/interfaces/IEloquent";

import { MongoRaw } from ".";

class Project {

    static getPipeline(whereClauses: TWhereClause[] | null, whereRaw: MongoRaw | null): object | null {

        if(!whereClauses && !whereRaw) return null;

        if(whereRaw) {
            return { $match: whereRaw };
        }
        

        return { $match: {} };
    }

}

export default Project