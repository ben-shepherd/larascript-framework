
import { IDocumentManager } from '@src/core/domains/database/interfaces/IDocumentManager';
import ModelNotFound from '@src/core/exceptions/ModelNotFound';
import { IModel, ModelConstructor } from '@src/core/interfaces/IModel';
import { IRepository } from '@src/core/interfaces/IRepository';
import { App } from '@src/core/services/App';

export default class Repository<Model extends IModel> implements IRepository<Model> {
    public modelCtor: ModelConstructor<Model>;
    public collectionName!: string;
    public connection!: string;

    constructor(collectionName: string, modelConstructor: ModelConstructor<Model>) {
        this.collectionName = collectionName;
        this.connection = new modelConstructor().connection
        this.modelCtor = modelConstructor;
    }

    /**
     * Get the query
     * @returns 
     */
    query(): IDocumentManager {
        return App.container('db').documentManager(this.connection).table(this.collectionName)
    }
    
    /**
     * Find or fail if no document found
     * @param filter
     * @returns 
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
     * @param id 
     * @returns 
     */
    async findById(id: string): Promise<Model | null> {
        const data = await this.query().findById(id)

        if(!data) {
            return null
        }

        return new this.modelCtor(data)
    }

    /**
     * Find a single document
     * @param filter 
     * @returns 
     */
    async findOne(filter: object = {}): Promise<Model | null> {
        const data = await this.query().findOne({filter});
        return data ? new this.modelCtor(data) : null;
    }

    /**
     * Find multiple documents
     * @param filter 
     * @returns 
     */
    async findMany(filter: object = {}, options?: object): Promise<Model[]> {
        const dataArray = await this.query().findMany({filter}, options)
        return (dataArray as unknown[]).map(data => new this.modelCtor(data));
    }
}