import Collection from "@src/core/domains/collections/Collection";
import EloquentRelationshipException from "@src/core/domains/eloquent/exceptions/EloquentRelationshipException";
import { IEloquent, IRelationship, TWhereClauseValue } from "@src/core/domains/eloquent/interfaces/IEloquent";
import BelongsTo from "@src/core/domains/eloquent/relational/BelongsTo";
import HasMany from "@src/core/domains/eloquent/relational/HasMany";
import { queryBuilder } from "@src/core/domains/eloquent/services/EloquentQueryBuilderService";
import { ICtor } from "@src/core/interfaces/ICtor";
import { IModel, IModelAttributes, ModelConstructor } from "@src/core/interfaces/IModel";
import { IRelationshipResolver } from "@src/core/domains/eloquent/interfaces/IEqloeuntRelationship";

class BaseRelationshipResolver implements IRelationshipResolver {

    /**
     * The connection name
     */
    protected connection: string

    /**
     * Constructor
     */
    constructor(connection: string) {
        this.connection = connection
    }

    /**
     * Gets the local key for the relationship.
     * @param relationship - The relationship to get the local key for.
     * @returns The local key for the relationship.
     */
    protected getLocalKey(relationship: IRelationship): string {
        return relationship.getLocalKey()
    }

    /**
     * Gets the foreign key for the relationship.
     * @param relationship - The relationship to get the foreign key for.
     * @returns The foreign key for the relationship.
     */
    protected getForeignKey(relationship: IRelationship): string {
        return relationship.getForeignKey()
    }

    /**
     * Gets the foreign model constructor for the relationship.
     * @param relationship - The relationship to get the foreign model constructor for.
     * @returns The foreign model constructor for the relationship.
     */
    protected getForeignModelCtor(relationship: IRelationship): ModelConstructor<IModel> {
        return relationship.getForeignModelCtor()
    }

    /**
     * Retrieves the related document for a relationship.
     * @param model - The source model.
     * @param relationship - The relationship to get the related document for.
     * @param connection - The connection to use.
     * @returns The related document or null if not found.
     */
    public async resolveData<Attributes extends IModelAttributes = IModelAttributes, K extends keyof Attributes = keyof Attributes>(model: IModel, relationship: IRelationship, connection: string): Promise<Attributes[K] | Collection<Attributes[K] | null>> {

        if(relationship instanceof BelongsTo) {
            return this.resolveBelongsTo<Attributes, K>(model, relationship, connection) as Promise<Attributes[K] | Collection<Attributes[K] | null>>
        }
    
        if(relationship instanceof HasMany) {
            return this.resolveHasMany<Attributes, K>(model, relationship, connection) as Promise<Collection<Attributes[K] | null>>
        }
    
        return null as unknown as Promise<Attributes[K] | Collection<Attributes[K] | null>>
    }
    

    /**
     * Retrieves the related document for a "belongs to" relationship.
     * @param model - The source model.
     * @param relationship - The relationship to get the related document for.
     * @param connection - The connection to use.
     * @returns The related document or null if not found.
     */
    protected async resolveBelongsTo<Attributes extends IModelAttributes = IModelAttributes, K extends keyof Attributes = keyof Attributes>(model: IModel, relationship: IRelationship, connection: string): Promise<Attributes[K] | null> {

        const localValue = model.getAttributeSync(relationship.getLocalKey()) as TWhereClauseValue;

        const foreignModelCtor = this.getForeignModelCtor(relationship)
        const foreignKey = this.getForeignKey(relationship)

        return await queryBuilder(foreignModelCtor, connection)
            .where(foreignKey, '=', localValue)
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
     * @param {IRelationship} relationship - The relationship to get the related documents for.
     * @param {string} connection - The connection to use.
     * @returns {Promise<Collection<Attributes[K]>>} A collection of related documents.
     */
    protected async resolveHasMany<Attributes extends IModelAttributes = IModelAttributes, K extends keyof Attributes = keyof Attributes>(model: IModel, relationship: IRelationship, connection: string): Promise<Collection<Attributes[K]>> {

        const localValue = model.getAttributeSync(relationship.getLocalKey()) as TWhereClauseValue;

        const foreignModelCtor = this.getForeignModelCtor(relationship)
        const foreignKey = this.getForeignKey(relationship)

        return await queryBuilder(foreignModelCtor, connection)
            .where(foreignKey, '=', localValue)
            .get() as unknown as Collection<Attributes[K]>
    }

    /**
     * Retrieves the relationship interface from the provided model.
     * @param model - The model instance.
     * @param relationshipName - The name of the relationship.
     * @returns The relationship interface or null if not found.
     * @throws {EloquentRelationshipException} If the relationship is invalid.
     */
    public static tryGetRelationshipInterface(model: IModel, relationshipName: string): IRelationship | null {
        try {
            return this.resolveRelationshipInterfaceByModelRelationshipName(model.constructor as ICtor<IModel>, relationshipName)
        }
        catch (error) {
            if(!(error instanceof EloquentRelationshipException)) {
                throw error
            }
        }

        return null
    }

    /**
     * Retrieves the relationship interface from the provided model relationship name.
     * @param modelCtor - The model constructor.
     * @param relationshipName - The name of the relationship (method name).
     * @returns The relationship interface.
     * @throws {EloquentRelationshipException} If the relationship is invalid.
     */
    public static resolveRelationshipInterfaceByModelRelationshipName(modelCtor: ICtor<IModel>, relationshipName: string): IRelationship {
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
    attachEloquentRelationship(eloquent: IEloquent, relationship: IRelationship, relationshipName: string) {

        const localKey = this.getLocalKey(relationship)
        const foreignModelCtor = this.getForeignModelCtor(relationship)
        const foreignKey = this.getForeignKey(relationship)

        if(relationship instanceof BelongsTo) {
            eloquent.join(foreignModelCtor, localKey, foreignKey, relationshipName)
        }

        // todo: implement has many relationship
    
        return eloquent
    }

}

export default BaseRelationshipResolver