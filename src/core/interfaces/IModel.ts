import { Db, ObjectId } from "mongodb";
import { BelongsToOptions } from "../domains/database/mongodb/relationships/BelongsTo";
import { HasManyOptions } from "../domains/database/mongodb/relationships/HasMany";
import IData from "./IData";
import IWithObserve from "./observer/IObservable";

export type GetDataOptions = {excludeGuarded: boolean}

export type Dates = string[]

export type ModelConstructor<M extends IModel = IModel> = new (...args: any[]) => M

export type ModelInstance<MCtor extends ModelConstructor<any>> = InstanceType<MCtor>

export interface IModel<D extends IData = IData> extends IWithObserve {
    connection: string;
    primaryKey: string;
    collection: string;
    fields: string[];
    guarded: string[];
    data: D | null;
    dates: Dates;
    timestamps: boolean;
    observeProperties: Record<string, string>;
    getId(): ObjectId | undefined;
    setAttribute(key: string, value: any): void;
    getAttribute(key: string): any;
    setTimestamp(dateTimeField: string, value: Date): void;
    getData(options: GetDataOptions): object | null;
    refresh(): Promise<D | null>;
    update(): Promise<void>;
    save(): Promise<void>;
    delete(): Promise<void>;
    getDb(): Db;
    belongsTo(options: BelongsToOptions): Promise<IModel | null>;
    hasMany(options: HasManyOptions): Promise<IModel[]>;
}