import { faker } from "@faker-js/faker";
import { ICtor } from "@src/core/interfaces/ICtor";
import IFactory from "@src/core/interfaces/IFactory";

import { IModel } from "@src/core/interfaces/IModel";
import IModelAttributes from "@src/core/interfaces/IModelData";

/**
 * Abstract base class for factories that create instances of a specific model.
 *
 * @template Model The type of model to create.
 * @template Data The type of data to pass to the model constructor.
 */
export default abstract class Factory<Model extends IModel = IModel> implements IFactory {

    /**
     * The faker instance to use.
     */
    protected faker = faker;

    /**
     * The constructor of the model to create.
     */
    protected modelCtor: ICtor<Model>;

    /**
     * Creates a new instance of the factory.
     *
     * @param modelCtor The constructor of the model to create.
     */
    constructor(modelCtor: ICtor<Model>) {
        this.modelCtor = modelCtor;
    }

    /**
     * Creates a new instance of the model.
     *
     * @param data The data to pass to the model constructor.
     * @returns A new instance of the model.
     */
    createWithData<Data extends IModelAttributes = IModelAttributes>(data: Data | null = null): Model {
        return new this.modelCtor(data)
    }

}
