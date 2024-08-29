import { HasManyOptions } from "@src/core/domains/database/relationships/HasMany";
import IWithObserve from "@src/core/domains/observer/interfaces/IWithObserve";
import IModelData from "@src/core/interfaces/IModelData";
import { ObjectId } from "mongodb";
import { IDatabaseQuery } from "@src/core/domains/database/interfaces/IDatabaseQuery";
import { BelongsToOptions } from "@src/core/domains/database/relationships/BelongsTo";

export type GetDataOptions = {excludeGuarded: boolean}

export type Dates = string[]

export type ModelConstructor<M extends IModel = IModel> = new (...args: any[]) => M

export type ModelInstance<MCtor extends ModelConstructor<any>> = InstanceType<MCtor>

export interface IModel<Data extends IModelData = IModelData> extends IWithObserve {
    connection: string;
    primaryKey: string;
    collection: string;
    fields: string[];
    guarded: string[];
    data: Data | null;
    dates: Dates;
    timestamps: boolean;
    observeProperties: Record<string, string>;
    getQuery(): IDatabaseQuery;
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
    belongsTo(options: BelongsToOptions): Promise<IModel | null>;
    hasMany(options: HasManyOptions): Promise<IModel[]>;
}