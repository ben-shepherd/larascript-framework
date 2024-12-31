import Collection from "@src/core/domains/collections/Collection";
import EloquentRelationshipException from "@src/core/domains/eloquent/exceptions/EloquentRelationshipException";
import { IEloquent, IRelationship, TWhereClauseValue } from "@src/core/domains/eloquent/interfaces/IEloquent";
import BelongsTo from "@src/core/domains/eloquent/relational/BelongsTo";
import HasMany from "@src/core/domains/eloquent/relational/HasMany";
import { queryBuilder } from "@src/core/domains/eloquent/services/EloquentQueryBuilderService";
import { ICtor } from "@src/core/interfaces/ICtor";
import { IModel, IModelAttributes } from "@src/core/interfaces/IModel";

class EloquentRelationship {

    /**
     * Retrieves the related document for a relationship.
     * @param model - The source model.
     * @param relationship - The name of the relationship.
     * @returns The related document or null if not found.
     */
    public static async fetchRelationshipData<Attributes extends IModelAttributes = IModelAttributes, K extends keyof Attributes = keyof Attributes>(model: IModel, relationship: IRelationship, connection: string) {

        if(relationship instanceof BelongsTo) {
            return this.fetchBelongsTo<Attributes, K>(model, relationship, connection)
        }
    
        if(relationship instanceof HasMany) {
            return this.fetchHasMany<Attributes, K>(model, relationship, connection)
        }
    
        return null
    }
    

    /**
     * Retrieves the related document for a "belongs to" relationship.
     * @param model - The source model.
     * @param relationship - The relationship interface.
     * @returns The related document or null if not found.
     */
    protected static async fetchBelongsTo<Attributes extends IModelAttributes = IModelAttributes, K extends keyof Attributes = keyof Attributes>(model: IModel, relationship: IRelationship, connection: string): Promise<Attributes[K] | null> {

        const localValue = model.getAttributeSync(relationship.getLocalKey()) as TWhereClauseValue;

        return await queryBuilder(relationship.getForeignModelCtor(), connection)
            .where(relationship.getForeignKey(), '=', localValue)
            .first() as Attributes[K]
    }

    /**
     * Retrieves the related documents for a "has many" relationship.
     *
     * This function executes a query to find all related documents based on the
     * foreign key that matches the local key of the provided model.
     *
     * @template Attributes The type of the model attributes.
     * @template K Type of the attribute key.
     * @param {IModel} model - The source model.
     * @param {IRelationship} relationship - The relationship interface.
     * @returns {Promise<Collection<Attributes[K]>>} A collection of related documents.
     */
    protected static async fetchHasMany<Attributes extends IModelAttributes = IModelAttributes, K extends keyof Attributes = keyof Attributes>(model: IModel, relationship: IRelationship, connection: string): Promise<Collection<Attributes[K]>> {

        const localValue = model.getAttributeSync(relationship.getLocalKey()) as TWhereClauseValue;

        return await queryBuilder(relationship.getForeignModelCtor(), connection)
            .where(relationship.getForeignKey(), '=', localValue)
            .get() as unknown as Collection<Attributes[K]>
    }

    /**
     * Retrieves the relationship interface from the provided model.
     * @param model - The model instance.
     * @param relationshipName - The name of the relationship.
     * @returns The relationship interface or null if not found.
     * @throws {EloquentRelationshipException} If the relationship is invalid.
     */
    public static getRelationshipInterface(model: IModel, relationshipName: string): IRelationship | null {
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
    public static fromModel(modelCtor: ICtor<IModel>, relationshipName: string): IRelationship {
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
            const foreignModelCtor = relationship.getForeignModelCtor();
            eloquent.join(foreignModelCtor, relationship.getLocalKey(), relationship.getForeignKey(), relationshipName)
        }

        /**
         * todo: implement has many relationship
         * test using 'with' on query builder
         */

        return eloquent
    }

}

export default EloquentRelationship