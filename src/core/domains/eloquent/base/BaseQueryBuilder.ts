import { ICtor } from "@src/core/interfaces/ICtor";
import { IModel } from "@src/core/interfaces/IModel";

export type TQueryBuilderOptions = {
    modelCtor: ICtor<IModel>;
}

class BaseQueryBuilder {

    /**
     * The constructor of the model associated with this query builder.
     */
    modelCtor!: ICtor<IModel>;

    /**
     * Constructor
     * @param {Object} options The options for the query builder
     * @param {ICtor<IModel>} options.modelCtor The constructor of the model associated with this query builder
     */
    constructor({ modelCtor }: TQueryBuilderOptions) {
        this.setModelCtor(modelCtor);
    }

    /**
     * Retrieves the constructor of the model associated with this query builder.
     * @returns {ICtor<IModel>} The model constructor.
     */
    getModelCtor(): ICtor<IModel> {
        return this.modelCtor;
    }

    /**
     * Sets the model constructor to use for the query builder
     * @param {ICtor<IModel>} modelCtor The constructor of the model to use for the query builder
     */
    setModelCtor(modelCtor: ICtor<IModel>) {
        this.modelCtor = modelCtor;
    }

}

export default BaseQueryBuilder