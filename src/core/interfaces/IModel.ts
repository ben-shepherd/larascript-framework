import IData from "./IData";

export type GetDataOptions = {excludeGuarded: boolean}

export type Dates = string[]

export type ModelConstructor<M extends IModel = IModel> = new (...args: any[]) => M

export type ModelInstance<MCtor extends ModelConstructor<any>> = InstanceType<MCtor>

export interface IModel {
    connection: string;
    primaryKey: string;
    collection: string;
    guarded: string[];
    data: IData | null;
    dates: Dates;
    timestamps: boolean;
    setAttribute(key: string, value: any): void;
    getAttribute(key: string): any;
    getData(options: GetDataOptions): object | null;
    refresh(): Promise<IData | null>;
    update(): Promise<void>;
    save(): Promise<void>;
    delete(): Promise<void>;
}