import { Db, ObjectId } from "mongodb";
import { BelongsToOptions } from "@src/core/domains/database/mongodb/relationships/BelongsTo";
import { HasManyOptions } from "@src/core/domains/database/mongodb/relationships/HasMany";
import IData from "@src/core/interfaces/IData";
import IWithObserve from "@src/core/interfaces/observer/IObservable";

export type GetDataOptions = {excludeGuarded: boolean}

export type Dates = string[]

export type ModelConstructor<M extends IModel = IModel> = new (...args: any[]) => M

export type ModelInstance<MCtor extends ModelConstructor<any>> = InstanceType<MCtor>

export interface IModel<Data extends IData = IData> extends IWithObserve {
    connection: string;
    primaryKey: string;
    collection: string;
    fields: string[];
    guarded: string[];
    data: Data | null;
    dates: Dates;
    timestamps: boolean;
    observeProperties: Record<string, string>;
    getId(): ObjectId | undefined;
    setAttribute(key: keyof Data, value: any): void;
    getAttribute(key: keyof Data): any;
    setTimestamp(dateTimeField: string, value: Date): void;
    fill(data: Partial<Data>): void;
    getData(options: GetDataOptions): Data | null;
    refresh(): Promise<Data | null>;
    update(): Promise<void>;
    save(): Promise<void>;
    delete(): Promise<void>;
    getDb(): Db;
    belongsTo(options: BelongsToOptions): Promise<IModel | null>;
    hasMany(options: HasManyOptions): Promise<IModel[]>;
}