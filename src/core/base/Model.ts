import { ObjectId } from "mongodb";
import IData from "../interfaces/IData";
import { GetDataOptions, IModel } from "../interfaces/IModel";
import MongoDB from "../services/MongoDB";

export default class Model<TModelData extends Record<any,any>> implements IModel {
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
}