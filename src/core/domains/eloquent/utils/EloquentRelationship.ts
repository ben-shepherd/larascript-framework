import { ICtor } from "@src/core/interfaces/ICtor";
import { IModel } from "@src/core/interfaces/IModel";
import IModelAttributes from "@src/core/interfaces/IModelData";
import EloquentRelationshipException from "@src/core/domains/eloquent/exceptions/EloquentRelationshipException";
import { IEloquent, IRelationship, TWhereClauseValue } from "@src/core/domains/eloquent/interfaces/IEloquent";
import BelongsTo from "@src/core/domains/eloquent/relational/BelongsTo";
import { queryBuilder } from "@src/core/domains/eloquent/services/EloquentQueryBuilderService";

class EloquentRelationship {

    /**
     * Retrieves the related document for a "belongs to" relationship.
     * @param model - The source model.
     * @param relationship - The relationship interface.
     * @returns The related document or null if not found.
     */
    protected static async fetchBelongsTo<Attributes extends IModelAttributes = IModelAttributes, K extends keyof Attributes = keyof Attributes>(model: IModel, relationship: IRelationship): Promise<Attributes[K] | null> {

        const localValue = model.getAttributeSync(relationship.getLocalKey()) as TWhereClauseValue;

        return await queryBuilder(relationship.getForeignModelCtor())
            .where(relationship.getForeignKey(), '=', localValue)
            .first() as Attributes[K]
    }


    /**
     * Retrieves the related document for a relationship.
     * @param model - The source model.
     * @param relationship - The name of the relationship.
     * @returns The related document or null if not found.
     */
    static async fetchRelationshipData<Attributes extends IModelAttributes = IModelAttributes, K extends keyof Attributes = keyof Attributes>(model: IModel, relationship: IRelationship): Promise<Attributes[K] | null> {

        if(relationship instanceof BelongsTo) {
            return this.fetchBelongsTo<Attributes, K>(model, relationship)
        }

        /** todo hasMany */

        return null
    }


    /**
     * Retrieves the relationship interface from the provided model.
     * @param model - The model instance.
     * @param relationshipName - The name of the relationship.
     * @returns The relationship interface or null if not found.
     * @throws {EloquentRelationshipException} If the relationship is invalid.
     */
    static getRelationshipInterface(model: IModel, relationshipName: string): IRelationship | null {
        try {
            return this.fromModel(model.constructor as ICtor<IModel>, relationshipName)
        }
        catch (error) {
            if(!(error instanceof EloquentRelationshipException)) {
                throw error
            }
        }

        return null
    }

    /** 
     * Retrieves the relationship class instance from the provided Local model.
     *
     * @throws {ExpressionException} If the relationship is invalid.
     * @return {IRelationship} The relationship class instance.
     */
    static fromModel(modelCtor: ICtor<IModel>, relationshipName: string): IRelationship {
        const model = new modelCtor(null);

        // Check if the relationship exists
        if(typeof model[relationshipName] !== 'function') {
            throw new EloquentRelationshipException('Invalid relationship \'' + relationshipName + '\'');
        }

        // Check if the relationship is valid
        const relationship = model[relationshipName]() as IRelationship;

        if(relationship?._relationshipInterface !== true) {
            throw new EloquentRelationshipException('Invalid relationship \'' + relationshipName + '\'');
        }

        return relationship
    }

    /**
     * Applies the relationship to the Eloquent expression.
     * 
     * @return {Eloquent} The Eloquent instance.
     */
    static updateEloquent(eloquent: IEloquent, relationship: IRelationship, relationshipName: string) {

        if(relationship instanceof BelongsTo) {
            const localModelCtor = relationship.getLocalModelCtor();
            const foreignModelCtor = relationship.getForeignModelCtor();
            const columnPrefix = `${relationshipName}_`;
            
            eloquent.setExpression(
                eloquent.cloneExpression()
                    .join({
                        localTable: new localModelCtor(null).useTableName(),
                        relatedTable: new foreignModelCtor(null).useTableName(),
                        localColumn: relationship.getLocalKey(),
                        relatedColumn: relationship.getForeignKey(),
                        type: 'left'
                    })
            )
            eloquent.setModelColumns(foreignModelCtor, { columnPrefix, targetProperty: relationshipName})
        }

        return eloquent
    }

}

export default EloquentRelationship