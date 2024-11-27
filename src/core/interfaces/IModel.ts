/* eslint-disable no-unused-vars */
import { IBelongsToOptions } from "@src/core/domains/database/interfaces/relationships/IBelongsTo";
import { IHasManyOptions } from "@src/core/domains/database/interfaces/relationships/IHasMany";
import IHasObserver from "@src/core/domains/observer/interfaces/IHasObserver";
import { ICtor } from "@src/core/interfaces/ICtor";
import IModelAttributes from "@src/core/interfaces/IModelData";
import { IHasAttributes } from "@src/core/interfaces/concerns/IHasAttributes";
import { IHasDatabaseConnection } from "@src/core/interfaces/concerns/IHasDatabaseConnection";
import { IHasPrepareDocument } from "@src/core/interfaces/concerns/IHasPrepareDocument";


export type GetDataOptions = {excludeGuarded: boolean}

export type ModelConstructor<M extends IModel = IModel> = new (...args: any[]) => M

export type ModelInstance<MCtor extends ModelConstructor<any>> = InstanceType<MCtor>

export interface IModel<Attributes extends IModelAttributes = IModelAttributes> extends IHasDatabaseConnection, IHasPrepareDocument, IHasObserver, IHasAttributes<Attributes> {
    primaryKey: string;
    fields: string[];
    guarded: string[];
    dates: string[];
    timestamps: boolean;
    json: string[];
    getId(): string | undefined;
    setTimestamp(dateTimeField: string, value: Date): Promise<void>;
    fill(data: Partial<Attributes>): Promise<void>;
    getData(options: GetDataOptions): Promise<Attributes | null>;
    toObject(): Promise<Attributes | null>;
    refresh(): Promise<Attributes | null>;
    update(): Promise<void>;
    save(): Promise<void>;
    delete(): Promise<void>;
    belongsTo<T extends IModel = IModel>(foreignModel: ICtor<T>, options: IBelongsToOptions): Promise<T | null>;
    hasMany<T extends IModel = IModel>(foreignModel: ICtor<T>, options: IHasManyOptions): Promise<T[]>;
}
