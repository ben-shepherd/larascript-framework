
import GenericRelationship from "@src/core/domains/eloquent/relational/GenericRelationship";
import { IModel, IModelAttributes } from "@src/core/interfaces/IModel";
import { Collection } from "collect.js";

import { IRelationship, TWhereClauseValue } from "../interfaces/IEloquent";
import { queryBuilder } from "../services/EloquentQueryBuilderService";

class HasMany extends GenericRelationship {

    /**
     * Fetches data for a "has many" relationship.
     * @param model - The source model.
     * @param relationship - The relationship interface.
     * @param connection - The database connection name.
     * @returns A collection of related documents.
     */
    protected static async fetchData<Attributes extends IModelAttributes = IModelAttributes, K extends keyof Attributes = keyof Attributes>(model: IModel, relationship: IRelationship, connection: string): Promise<Collection<Attributes[K]>> {

        const localValue = model.getAttributeSync(relationship.getLocalKey()) as TWhereClauseValue;

        return await queryBuilder(relationship.getForeignModelCtor(), connection)
            .where(relationship.getForeignKey(), '=', localValue)
            .get() as unknown as Collection<Attributes[K]>
    }

}

export default HasMany