import { IDocumentManager } from "@src/core/domains/database/interfaces/IDocumentManager";
import ModelNotFound from "@src/core/exceptions/ModelNotFound";
import { IModel, ModelConstructor } from "@src/core/interfaces/IModel";
import { IRepository } from "@src/core/interfaces/IRepository";
import { App } from "@src/core/services/App";

/**
 * Base class for repositories
 */
export default class Repository<Model extends IModel> implements IRepository<Model> {

    /**
     * The model constructor
     */
    public modelCtor: ModelConstructor<Model>;

    /**
     * The name of the collection/table
     */
    public collectionName!: string;

    /**
     * The connection to use for queries
     */
    public connection!: string;

    /**
     * Constructor
     * @param collectionName The name of the collection/table
     * @param modelConstructor The model constructor
     */
    constructor(modelConstructor: ModelConstructor<Model>, collectionName?: string) {
        this.collectionName = collectionName ?? (new modelConstructor()).table;
        this.connection = new modelConstructor().connection
        this.modelCtor = modelConstructor;
    }

    /**
     * Set the model constructor
     * @param modelCtor The model constructor
     */
    protected setModelCtor(modelCtor: ModelConstructor<Model>) {
        this.modelCtor = modelCtor;
    }

    /**
     * Get the query builder
     * @returns The query builder
     */
    documentManager(): IDocumentManager {
        return App.container('db').documentManager(this.connection).table(this.collectionName)
    }
    
    /**
     * Find or fail if no document found
     * @param filter The filter to use for the search
     * @returns The found model or throws a ModelNotFound exception
     * @throws ModelNotFound
     */
    async findOrFail(filter: object): Promise<Model> {
        const model = await this.findOne(filter)

        if(!model) {
            throw new ModelNotFound()
        }

        return model
    }

    /**
     * Find document by id
     * @param id The id of the document to find
     * @returns The found model or null
     */
    async findById(id: string): Promise<Model | null> {
        const data = await this.documentManager().findById(id)

        if(!data) {
            return null
        }

        return new this.modelCtor(data)
    }

    /**
     * Find a single document
     * @param filter The filter to use for the search
     * @returns The found model or null
     */
    async findOne(filter: object = {}): Promise<Model | null> {
        const data = await this.documentManager().findOne({filter});
        return data ? new this.modelCtor(data) : null;
    }

    /**
     * Find multiple documents
     * @param filter The filter to use for the search
     * @param options The options to use for the query
     * @returns The found models
     */
    async findMany(filter: object = {}, options?: object): Promise<Model[]> {
        const dataArray = await this.documentManager().findMany({...options, filter})
        return (dataArray as unknown[]).map(data => new this.modelCtor(data));
    }

}
