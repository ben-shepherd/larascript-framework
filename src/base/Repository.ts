import { ObjectId } from 'mongodb';

import IData from '../interfaces/IData';
import { IModel } from '../interfaces/IModel';
import { IRepository } from '../interfaces/IRepository';
import MongoDB from '../services/MongoDB';

type Constructor<T> = new (...args: any[]) => T

class Repository<T extends IModel> implements IRepository {
    private ctor: Constructor<T>;
    private collectionName!: string;

    constructor(collectionName: string, ctor: Constructor<T>) {
        this.collectionName = collectionName;
        this.ctor = ctor;
    }

    async findById(_id: string): Promise<T | null> {
        const data = await MongoDB.getInstance().getDatabase().collection(this.collectionName).findOne({ _id: new ObjectId(_id) }) as IData | null;
        return data ? new this.ctor(data) : null;
    }

    async find(query: object = {}): Promise<T | null> {
        const data = await MongoDB.getInstance().getDatabase().collection(this.collectionName).findOne(query) as IData | null;
        return data ? new this.ctor(data) : null;
    }

    async findMany(query: object = {}): Promise<T[]> {
        const dataArray = await MongoDB.getInstance().getDatabase().collection(this.collectionName).find(query).toArray() as IData[];
        return dataArray.map(data => new this.ctor(data));
    }
}

export default Repository