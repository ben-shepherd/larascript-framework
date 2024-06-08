import { ObjectId } from 'mongodb';

import BelongsTo from '../domains/Database/Relationships/belongsTo';
import IData from '../interfaces/IData';
import { GetDataOptions, IModel } from '../interfaces/IModel';
import MongoDB from '../services/MongoDB';

export interface BaseModelData {
    _id?: ObjectId | undefined
    createdAt?: Date,
    updatedAt?: Date,
    [key: string]: any
}

export default class Model<TModelData extends BaseModelData> implements IModel {
    primaryKey: string = '_id';
    data: TModelData | null;
    collection!: string;

    fields: string[] = [];
    guarded: string[] = [];

    constructor(data: TModelData | null) {
        this.data = data;
    }

    getId(): ObjectId | undefined {
        return this.getAttribute(this.primaryKey) ?? undefined
    }

    getAttribute<K extends keyof TModelData>(key: K): TModelData[K] | null {
        return this.data?.[key] ?? null;
    }
    
    setAttribute<K extends keyof TModelData>(key: K, value: any): void {
        if(!this.fields.includes(key as string)) {
            throw new Error(`Attribute ${key as string} not found in model ${this.collection}`);
        }
        if(this.data) {
            this.data[key] = value;
        }
    }

    getData(options: GetDataOptions): TModelData | null {
        let data = this.data;

        if(options.excludeGuarded) {
            data = Object.fromEntries(Object.entries(data ?? {}).filter(([key]) => !this.guarded.includes(key))) as TModelData
        }
        
        return data;
    }

    async refresh(): Promise<IData | null> {
        if(!this.data) return null;
        this.data = await MongoDB
            .getInstance()
            .getDb()
            .collection(this.collection)
            .findOne({ [this.primaryKey]: this.getId() }) as TModelData | null ?? null;
        return this.data
    }

    async update(): Promise<void> {
        if(!this.getId()) return;
        await MongoDB.getInstance()
        .getDb()
        .collection(this.collection)
        .updateOne({ [this.primaryKey]: this.getId() }, { $set: this.data as IData });
    }
    
    async save(): Promise<void> {
        if(this.data && !this.getId()) {
            await MongoDB.getInstance()
            .getDb()
            .collection(this.collection)
            .insertOne(this.data);
            await this.refresh();
            return;
        }

        await this.update()
        await this.refresh()
    }

    async delete(): Promise<void> {
        if(!this.data) return;
        await MongoDB.getInstance().getDb().collection(this.collection).deleteOne({ [this.primaryKey]: this.getId() })
        this.data = null
    }

    async belongsTo<
        LocalData extends BaseModelData,
        LocalModel extends Model<LocalData>,
        ForeignData extends BaseModelData,
        ForeignModel extends Model<ForeignData>
    > (
        model: LocalModel,
        localKey: keyof LocalData,
        foreignModelCtor: new (...any: any[]) => ForeignModel,
        foreignKey: keyof ForeignData,
    ): Promise<ForeignModel | null> 
    {
        const data = await new BelongsTo<LocalData, LocalModel, ForeignData>().handle(model, new foreignModelCtor().collection, foreignKey, localKey)

        if(!data) return null

        return new foreignModelCtor(data)
    }
} 
