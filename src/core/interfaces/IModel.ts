/* eslint-disable no-unused-vars */
import { IBelongsToOptionsLegacy } from "@src/core/domains/database/interfaces/relationships/IBelongsTo";
import { IHasManyOptions } from "@src/core/domains/database/interfaces/relationships/IHasMany";
import IHasObserver from "@src/core/domains/observer/interfaces/IHasObserver";
import { ICtor } from "@src/core/interfaces/ICtor";
import IModelAttributes from "@src/core/interfaces/IModelData";
import { IHasDatabaseConnection } from "@src/core/interfaces/concerns/IHasDatabaseConnection";
import { IHasPrepareDocument } from "@src/core/interfaces/concerns/IHasPrepareDocument";

import BelongsTo from "../domains/eloquent/relational/BelongsTo";


export type GetDataOptions = {excludeGuarded: boolean}

export type ModelConstructor<M extends IModel = IModel> = {
    new (...args: any[]): M;
    create<T extends M>(data: T['attributes'] | null): T;
}

export type ModelInstance<MCtor extends ModelConstructor<any>> = InstanceType<MCtor>

export interface IModel<Attributes extends IModelAttributes = IModelAttributes, K extends keyof Attributes = keyof Attributes> extends IHasDatabaseConnection, IHasPrepareDocument, IHasObserver {
    [key: string]: unknown;
    primaryKey: string;
    fields: string[];
    guarded: string[];
    dates: string[];
    timestamps: boolean;
    json: string[];
    attributes: Attributes | null;
    original: Attributes | null;
    attr<K extends keyof Attributes = keyof Attributes>(key: K, value?: unknown): Promise<Attributes[K] | null | undefined>;
    setAttribute(key: keyof Attributes, value?: unknown): Promise<void>;
    getAttributeSync<K extends keyof Attributes = keyof Attributes>(key: K): Attributes[K] | null
    getAttribute(key: keyof Attributes): Promise<Attributes[keyof Attributes] | null>
    getAttributes(...args: any[]): Attributes | null;
    getOriginal(key: keyof Attributes): Attributes[keyof Attributes] | null
    getDirty(): Record<keyof Attributes, any> | null
    isDirty(): boolean;
    getFields(): string[];
    useTableName(): string;
    getId(): string | undefined;
    setTimestamp(dateTimeField: string, value: Date): Promise<void>;
    fill(data: Partial<Attributes>): Promise<void>;
    getData(options: GetDataOptions): Promise<Attributes | null>;
    toObject(): Promise<Attributes | null>;
    refresh(): Promise<Attributes | null>;
    update(): Promise<void>;
    save(): Promise<void>;
    delete(): Promise<void>;
    belongsToLegacy<T extends IModel = IModel>(foreignModel: ICtor<T>, options: IBelongsToOptionsLegacy): Promise<T | null>;
    belongsTo<ForiegnModel extends IModel = IModel>(foreignModel: ICtor<ForiegnModel>, options: Omit<IBelongsToOptionsLegacy, 'foreignTable'>): BelongsTo;
    hasMany<T extends IModel = IModel>(foreignModel: ICtor<T>, options: IHasManyOptions): Promise<T[]>;
}
