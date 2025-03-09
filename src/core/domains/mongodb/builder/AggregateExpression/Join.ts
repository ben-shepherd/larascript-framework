import Eloquent from "@src/core/domains/eloquent/Eloquent";
import { JoinTypes, TJoin } from "@src/core/domains/eloquent/interfaces/IEloquent";

class Join {

    /**
     * Constructs a MongoDB pipeline stage for limiting the number of documents.
     * 
     * @param limit - The maximum number of documents to return. If null, no limit is applied.
     * @returns An object representing the $limit stage in a MongoDB aggregation pipeline, or null if no limit is specified.
     */
    static getPipeline(joins: TJoin | TJoin[] | null): object[] | null {
        if(!joins) return null;

        const joinsArray = Array.isArray(joins) ? joins : [joins]
        const result: object[] = []

        for(const join of joinsArray) {
            result.push(
                this.normalizeJoin(join)
            )
        }

        return result
    }

    /**
     * Normalizes a join object to a MongoDB lookup pipeline stage.
     * 
     * @param join - The join object to normalize.
     * @returns An object representing the $lookup stage in a MongoDB aggregation pipeline.
     */
    static normalizeJoin(join: TJoin): object {

        switch(join.type) {
        case JoinTypes.LEFT:
        case JoinTypes.INNER:
        case JoinTypes.FULL:
        case JoinTypes.CROSS:
            return {
                $lookup: {
                    from: join.relatedTable,
                    localField: join.localColumn,
                    foreignField: join.relatedColumn,
                    as: Eloquent.getJoinAsPath(join.relatedTable ?? '', join.localColumn ?? '', join.relatedColumn ?? '')
                }
            }
        case JoinTypes.RIGHT:
            return {
                $lookup: {
                    from: join.relatedTable,
                    localField: join.relatedColumn,
                    foreignField: join.localColumn,
                    as: Eloquent.getJoinAsPath(join.relatedTable ?? '', join.localColumn ?? '', join.relatedColumn ?? '')
                }
            }
        }
    }

}

export default Join