import { Collection, FindOptions, ObjectId } from 'mongodb';

import ModelNotFound from '@src/core/exceptions/ModelNotFound';
import { IModel, ModelConstructor } from '@src/core/interfaces/IModel';
import IModelData from '@src/core/interfaces/IModelData';
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
     * Get the MongoDB Collection
     */
    async collection(): Promise<Collection> {
        return App.container('mongodb').getDb().collection(this.collectionName)
    }
    
    /**
     * Find or fail if no document found
     * @param _id 
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
     * Find document by _id
     * @param _id 
     * @returns 
     */
    async findById(_id: string): Promise<Model | null> {
        const data = await App.container('mongodb').getDb(this.connection).collection(this.collectionName).findOne({ _id: new ObjectId(_id) }) as IModelData | null;
        return data ? new this.modelCtor(data) : null;
    }

    /**
     * Find a single document
     * @param filter 
     * @returns 
     */
    async findOne(filter: object = {}): Promise<Model | null> {
        const data = await App.container('mongodb').getDb(this.connection).collection(this.collectionName).findOne(filter) as Model | null;
        return data ? new this.modelCtor(data) : null;
    }

    /**
     * Find multiple documents
     * @param query 
     * @returns 
     */
    async findMany(query: object = {}, options?: FindOptions): Promise<Model[]> {
        const dataArray = await App.container('mongodb').getDb(this.connection).collection(this.collectionName).find(query, options).toArray() as IModelData[];
        return dataArray.map(data => new this.modelCtor(data));
    }
}