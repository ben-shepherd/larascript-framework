/* eslint-disable no-unused-vars */
import { IModel } from "@src/core/interfaces/IModel";

export type FactoryConstructor<Model extends IModel> = {
    new (...args: any[]): IFactory<Model>
}

export default interface IFactory<Model extends IModel> {
    create(...args: any[]): Model;
    make(data?: Model['attributes']): Model;
    getDefinition(): Model['attributes'];

}