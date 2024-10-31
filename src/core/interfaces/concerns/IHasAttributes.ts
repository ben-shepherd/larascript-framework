/* eslint-disable no-unused-vars */
import IModelAttributes from "../IModelData";


export interface IHasAttributesSetAttributeOptions {
    broadcast: boolean;
}

export interface IHasAttributes {

    attributes: IModelAttributes | null;

    original: IModelAttributes | null;

    attr(key: keyof IModelAttributes, value?: unknown): IModelAttributes[keyof IModelAttributes] | null | undefined;

    setAttribute(key: keyof IModelAttributes, value?: unknown): Promise<void>;

    getAttribute(key: keyof IModelAttributes): IModelAttributes[keyof IModelAttributes] | null

    getOriginal(key: keyof IModelAttributes): IModelAttributes[keyof IModelAttributes] | null

    getDirty(): Record<keyof IModelAttributes, any> | null

    isDirty(): boolean;
}