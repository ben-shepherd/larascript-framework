import IData from "./IData";


export interface IModel {
    primaryKey: string;
    collection: string;
    data: IData | null;
    setAttribute(key: string, value: any): void;
    getAttribute(key: string): any;
    getData(): object | null;
    refresh(): Promise<IData | null>;
    save(): Promise<void>;
    delete(): Promise<void>;
}