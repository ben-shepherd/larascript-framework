import { ObjectId } from 'mongodb';

import MongoDB from '../domains/database/mongodb/services/MongoDB';
import IData from '../interfaces/IData';
import { IModel } from '../interfaces/IModel';
import { IRepository } from '../interfaces/IRepository';

type Constructor<M extends IModel> = new (...args: any[]) => M

export default abstract class Repository<M extends IModel> implements IRepository {
    public model: Constructor<M>;
    private collectionName!: string;
    private connection!: string;

    constructor(collectionName: string, ctor: Constructor<M>) {
        this.collectionName = collectionName;
        this.connection = new ctor().connection
        this.model = ctor;
    }

    async findById(_id: string): Promise<M | null> {
        const data = await MongoDB.getInstance().getDb(this.connection).collection(this.collectionName).findOne({ _id: new ObjectId(_id) }) as IData | null;
        return data ? new this.model(data) : null;
    }

    async findOne(query: object = {}): Promise<M | null> {
        const data = await MongoDB.getInstance().getDb(this.connection).collection(this.collectionName).findOne(query) as M | null;
        return data ? new this.model(data) : null;
    }

    async findMany(query: object = {}): Promise<M[]> {
        const dataArray = await MongoDB.getInstance().getDb(this.connection).collection(this.collectionName).find(query).toArray() as IData[];
        return dataArray.map(data => new this.model(data));
    }
}