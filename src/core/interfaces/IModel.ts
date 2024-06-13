import IData from "./IData";

export type GetDataOptions = {
    excludeGuarded: boolean
}

export type Dates = string[]

export interface IModel {
    connection: string;
    primaryKey: string;
    collection: string;
    guarded: string[];
    data: IData | null;
    dates: string[];
    timestamps: boolean;
    setAttribute(key: string, value: any): void;
    getAttribute(key: string): any;
    getData(options: GetDataOptions): object | null;
    refresh(): Promise<IData | null>;
    save(): Promise<void>;
    delete(): Promise<void>;
}