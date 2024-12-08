import { ICtor } from "@src/core/interfaces/ICtor";
import { IModel, ModelConstructor } from "@src/core/interfaces/IModel";

import { IBelongsToOptions, IRelationship } from "../interfaces/IEloquent";

class BelongsTo implements IRelationship {

    _relationshipInterface = true as IRelationship['_relationshipInterface'];

    constructor(
        // eslint-disable-next-line no-unused-vars
        protected localModel: ModelConstructor<IModel>,
        // eslint-disable-next-line no-unused-vars
        protected foreignModel: ModelConstructor<IModel>,
        // eslint-disable-next-line no-unused-vars
        protected options: Omit<IBelongsToOptions, 'foreignTable'>
    ) {}

    /**
     * Retrieves the constructor of the local model in the "belongs to" relationship.
     * @returns {ICtor<IModel>} The constructor of the local model.
     */
    getLocalModelCtor(): ModelConstructor<IModel> {
        return this.localModel
    }

    /**
     * Retrieves the constructor of the related model in the "belongs to" relationship.
     * @returns {ICtor<IModel>} The constructor of the related model.
     */
    getForeignModelCtor(): ModelConstructor<IModel> {
        return this.foreignModel
    }

    /**
     * Retrieves the table name of the related model in the "belongs to" relationship.
     * @returns {string} The table name of the related model.
     */
    getForeignTableName(): string {
        return new this.foreignModel().useTableName()
    }

    /**
     * Retrieves the options for the "belongs to" relationship,
     * including the foreign table name derived from the related model.
     * 
     * @returns {IBelongsToOptions} The complete set of options 
     * for the relationship, with the foreign table name.
     */
    getOptions(): IBelongsToOptions {
        return {
            ...this.options,
            foreignTable: new this.foreignModel().useTableName()
        } as IBelongsToOptions
    }

    /**
     * Retrieves the name of the local key in the "belongs to" relationship.
     * This is the key that refers to the foreign key in the related model.
     * @returns {string} The name of the local key.
     */
    getLocalKey(): string {
        return this.options.localKey as string
    }

    /**
     * Retrieves the name of the foreign key in the "belongs to" relationship.
     * This is the key in the related model that the local key refers to.
     * @returns {string} The name of the foreign key.
     */
    getForeignKey(): string {
        return (this.options.foreignKey ?? 'id') as string
    }

}

export default BelongsTo