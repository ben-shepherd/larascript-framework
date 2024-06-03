import IData from "../interfaces/IData";
import { GetDataOptions, IModel } from "../interfaces/IModel";
import MongoDB from "../services/MongoDB";

export default class BaseModel implements IModel {
    primaryKey: string = '_id';
    data: IData | null;
    collection!: string;
    guarded: string[] = [];

    constructor(data: IData | null) {
        this.data = data;
    }

    getId(): number | null {
        return this.getAttribute(this.primaryKey) ?? null
    }

    getAttribute<K extends keyof IData>(key: K): IData[K] | null {
        return this.data?.[key] ?? null;
    }
    
    setAttribute<K extends keyof IData>(key: K, value: IData[K]): void {
        if(this.data) {
            this.data[key] = value;
        }
    }

    getData(options: GetDataOptions): object | null {
        let data = this.data;

        if(options.excludeGuarded) {
            data = Object.fromEntries(Object.entries(data ?? {}).filter(([key]) => !this.guarded.includes(key)))
        }
        
        return data;
    }

    async refresh(): Promise<IData | null> {
        if(!this.data) return null;
        this.data = await MongoDB.getInstance().getDatabase().collection(this.collection).findOne({ [this.primaryKey]: this.getId() }) as IData ?? null;
        return this.data
    }

    async update(): Promise<void> {
        if(!this.getId()) return;
        await MongoDB.getInstance().getDatabase().collection(this.collection).updateOne({ [this.primaryKey]: this.getId() }, { $set: this.data as IData })
    }
    
    async save(): Promise<void> {
        console.log('SAVE EVENT', this.collection, {hasId: this.getId()})

        if(this.data && !this.getId()) {
            console.log('saving')
            await MongoDB.getInstance().getDatabase().collection(this.collection).insertOne(this.data)
            await this.refresh()
            return;
        }

        await this.update()
        await this.refresh()
    }

    async delete(): Promise<void> {
        if(!this.data) return;
        await MongoDB.getInstance().getDatabase().collection(this.collection).deleteOne({ [this.primaryKey]: this.getId() })
        this.data = null
    }
}