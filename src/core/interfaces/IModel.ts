/* eslint-disable no-unused-vars */
import { IBelongsToOptionsLegacy } from "@src/core/domains/database/interfaces/relationships/IBelongsTo";
import { IdGeneratorFn } from "@src/core/domains/eloquent/interfaces/IEloquent";
import BelongsTo from "@src/core/domains/eloquent/relational/BelongsTo";
import IHasObserver from "@src/core/domains/observer/interfaces/IHasObserver";
import { ICtor } from "@src/core/interfaces/ICtor";
import IModelAttributes from "@src/core/interfaces/IModelData";


export type GetAttributesOptions = {excludeGuarded: boolean}

export type ModelConstructor<M extends IModel = IModel> = {
    new (...args: any[]): M;
    create<T extends M>(data?: T['attributes'] | null): T;
    getTable(): string;
    getPrimaryKey(): string;
}

export type ModelInstance<MCtor extends ModelConstructor<any>> = InstanceType<MCtor>

export type ModelAttribtues<Model extends IModel> = Model['attributes']

export interface IModel<Attributes extends IModelAttributes = IModelAttributes> extends IHasObserver {
    [key: string]: unknown;
    connection: string;
    primaryKey: string;
    fields: string[];
    guarded: string[];
    dates: string[];
    timestamps: boolean;
    json: string[];
    attributes: Attributes | null;
    original: Attributes | null;
    relationships: string[];
    getIdGeneratorFn(): IdGeneratorFn | undefined;
    attr<K extends keyof Attributes = keyof Attributes>(key: K, value?: unknown): Promise<Attributes[K] | null | undefined>;
    attrSync<K extends keyof Attributes = keyof Attributes>(key: K, value?: unknown): Attributes[K] | null | undefined;
    setAttribute(key: keyof Attributes, value?: unknown): Promise<void>;
    getAttributeSync<K extends keyof Attributes = keyof Attributes>(key: K): Attributes[K] | null
    getAttribute(key: keyof Attributes): Promise<Attributes[keyof Attributes] | null>
    getAttributes(options: GetAttributesOptions): Attributes | null;
    getOriginal(key: keyof Attributes): Attributes[keyof Attributes] | null
    getDirty(): Record<keyof Attributes, any> | null
    isDirty(): boolean;
    getFields(): string[];
    useTableName(): string;
    getId(): string | undefined;
    setTimestamp(dateTimeField: string, value: Date): Promise<void>;
    fill(data: Partial<Attributes>): Promise<void>;

    /**
     * @deprecated
     */
    getData(options: GetAttributesOptions): Promise<Attributes | null>;
    toObject(options?: GetAttributesOptions): Promise<Attributes | null>;
    refresh(): Promise<Attributes | null>;
    update(): Promise<void>;
    save(): Promise<void>;
    delete(): Promise<void>;
    belongsTo<ForiegnModel extends IModel = IModel>(foreignModel: ICtor<ForiegnModel>, options: Omit<IBelongsToOptionsLegacy, 'foreignTable'>): BelongsTo;
}
