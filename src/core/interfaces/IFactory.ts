/* eslint-disable no-unused-vars */
import { IModel } from "./IModel";

export type FactoryConstructor<Model extends IModel = IModel> = {
    new (...args: any[]): IFactory<Model>;
}


export default interface IFactory<Model extends IModel = IModel> {
    create(...args: any[]): any;
    getDefinition(): Model['attributes'];
    make(data?: Model['attributes']): Model;
}