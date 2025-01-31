import { faker } from "@faker-js/faker";
import IFactory from "@src/core/interfaces/IFactory";
import { IModel, IModelAttributes, ModelConstructor } from "@src/core/interfaces/IModel";

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
    protected abstract model: ModelConstructor<Model>;

    /**
     * Creates a new instance of the model.
     *
     * @param data The data to pass to the model constructor.
     * @returns A new instance of the model.
     */
    create<Data extends IModelAttributes = IModelAttributes>(data: Data | null = null): Model {
        return this.model.create(data);
    }

    /**
     * Get the definition of the model.
     * 
     * @returns The definition of the model.
     */
    getDefinition(): Model['attributes'] {
        return {} as Model['attributes']
    }

    /**
     * Make a new instance of the model.
     * 
     * @param data The data to pass to the model constructor.
     * @returns A new instance of the model.
     */
    make(data?: Model['attributes']): Model {
        return this.create({...this.getDefinition(), ...data})
    }

}
