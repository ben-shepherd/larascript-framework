import { ObjectId } from 'mongodb';

import IData from '../interfaces/IData';
import { IModel } from '../interfaces/IModel';
import { IRepository } from '../interfaces/IRepository';
import MongoDB from '../services/MongoDB';

type Constructor<M extends IModel> = new (...args: any[]) => M

class Repository<M extends IModel> implements IRepository {
    private ctor: Constructor<M>;
    private collectionName!: string;

    constructor(collectionName: string, ctor: Constructor<M>) {
        this.collectionName = collectionName;
        this.ctor = ctor;
    }

    async findById(_id: string): Promise<M | null> {
        const data = await MongoDB.getInstance().getDb().collection(this.collectionName).findOne({ _id: new ObjectId(_id) }) as IData | null;
        return data ? new this.ctor(data) : null;
    }

    async find(query: object = {}): Promise<M | null> {
        const data = await MongoDB.getInstance().getDb().collection(this.collectionName).findOne(query) as IData | null;
        return data ? new this.ctor(data) : null;
    }

    async findMany(query: object = {}): Promise<M[]> {
        const dataArray = await MongoDB.getInstance().getDb().collection(this.collectionName).find(query).toArray() as IData[];
        return dataArray.map(data => new this.ctor(data));
    }
}

export default Repository