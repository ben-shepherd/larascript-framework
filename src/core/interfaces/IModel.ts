/* eslint-disable no-unused-vars */
import { IDocumentManager } from "@src/core/domains/database/interfaces/IDocumentManager";
import { IBelongsToOptions } from "@src/core/domains/database/interfaces/relationships/IBelongsTo";
import { IHasManyOptions } from "@src/core/domains/database/interfaces/relationships/IHasMany";
import IWithObserve from "@src/core/domains/observer/interfaces/IWithObserve";
import { ICtor } from "@src/core/interfaces/ICtor";
import IModelData from "@src/core/interfaces/IModelData";

export type GetDataOptions = {excludeGuarded: boolean}

export type ModelConstructor<M extends IModel = IModel> = new (...args: any[]) => M

export type ModelInstance<MCtor extends ModelConstructor<any>> = InstanceType<MCtor>

/**
 * @interface IModel
 * @description Abstract base class for database models.
 * @property {string} connection The database connection to use.
 * @property {string} primaryKey The primary key of the model.
 * @property {string} table The name of the table.
 * @property {string[]} fields The fields of the model.
 * @property {string[]} guarded The fields that are guarded from mass assignment.
 * @property {string[] | null} data The data of the model.
 * @property {string[]} dates The fields that are dates.
 * @property {boolean} timestamps Whether the model uses timestamps.
 * @property {string[]} json The fields that are JSON.
 * @property {Record<string, string>} observeProperties The properties to observe.
 * @method prepareDocument Prepare the document for database operations.
 * @method getDocumentManager Get the document manager for database operations.
 * @method getId Get the primary key value of the model.
 * @method setAttribute Set the value of a specific attribute in the model's data.
 * @method getAttribute Get the value of a specific attribute from the model's data.
 * @method setTimestamp Set a timestamp on a Date field.
 * @method fill Fill the model with data.
 * @method getData Get the data of the model, optionally excluding guarded fields.
 * @method refresh Refresh the model's data from the database.
 * @method update Update the model in the database.
 * @method save Save the model to the database.
 * @method delete Delete the model from the database.
 * @method belongsTo Handle "belongs to" relationship.
 * @method hasMany Handle "has many" relationship.
 */
export interface IModel<Data extends IModelData = IModelData> extends IWithObserve {
    connection: string;
    primaryKey: string;
    table: string;
    fields: string[];
    guarded: string[];
    data: Data | null;
    dates: string[];
    timestamps: boolean;
    json: string[];
    observeProperties: Record<string, string>;
    prepareDocument<T = object>(): T;
    getDocumentManager(): IDocumentManager;
    getId(): string | undefined;
    setAttribute(key: keyof Data, value: any): void;
    getAttribute(key: keyof Data): any;
    setTimestamp(dateTimeField: string, value: Date): void;
    fill(data: Partial<Data>): void;
    getData(options: GetDataOptions): Data | null;
    refresh(): Promise<Data | null>;
    update(): Promise<void>;
    save(): Promise<void>;
    delete(): Promise<void>;
    belongsTo<T extends IModel = IModel>(foreignModel: ICtor<T>, options: IBelongsToOptions): Promise<T | null>;
    hasMany<T extends IModel = IModel>(foreignModel: ICtor<T>, options: IHasManyOptions): Promise<T[]>;
}
