
import GenericRelationship from "@src/core/domains/eloquent/relational/GenericRelationship";
import { IModel, IModelAttributes } from "@src/core/interfaces/IModel";

import { IRelationship, TWhereClauseValue } from "../interfaces/IEloquent";
import { queryBuilder } from "../services/EloquentQueryBuilderService";

class BelongsTo extends GenericRelationship {

    /**
     * Fetches data for a "belongs to" relationship.
     * @param model - The source model.
     * @param relationship - The relationship interface.
     * @param connection - The database connection name.
     * @returns The related document or null if not found.
     */
    static async fetchData<Attributes extends IModelAttributes = IModelAttributes, K extends keyof Attributes = keyof Attributes>(model: IModel, relationship: IRelationship, connection?: string): Promise<Attributes[K] | null> {
        const localValue = model.getAttributeSync(relationship.getLocalKey()) as TWhereClauseValue;

        return await queryBuilder(relationship.getForeignModelCtor(), connection)
            .where(relationship.getForeignKey(), '=', localValue)
            .first() as Attributes[K]
    }

}

export default BelongsTo