import { ObjectId } from 'mongodb';

import { IRepository } from '@src/core/interfaces/IRepository';
import MongoDB from '../domains/database/mongodb/services/MongoDB';
import IData from '../interfaces/IData';
import { IModel, ModelConstructor } from '../interfaces/IModel';

export default abstract class Repository<Model extends IModel> implements IRepository<Model> {
    public model: ModelConstructor<Model>;
    public collectionName!: string;
    public connection!: string;

    constructor(collectionName: string, modelConstructor: ModelConstructor<Model>) {
        this.collectionName = collectionName;
        this.connection = new modelConstructor().connection
        this.model = modelConstructor;
    }

    async findById(_id: string): Promise<Model | null> {
        const data = await MongoDB.getInstance().getDb(this.connection).collection(this.collectionName).findOne({ _id: new ObjectId(_id) }) as IData | null;
        return data ? new this.model(data) : null;
    }

    async findOne(query: object = {}): Promise<Model | null> {
        const data = await MongoDB.getInstance().getDb(this.connection).collection(this.collectionName).findOne(query) as Model | null;
        return data ? new this.model(data) : null;
    }

    async findMany(query: object = {}): Promise<Model[]> {
        const dataArray = await MongoDB.getInstance().getDb(this.connection).collection(this.collectionName).find(query).toArray() as IData[];
        return dataArray.map(data => new this.model(data));
    }
}