/* eslint-disable no-unused-vars */
export type TRegisterMap = Map<string, unknown>;

export interface IRegsiterList {
    [key: string]: TRegisterMap
};

export interface IHasRegisterableConcern
{
    register(key: string, value: unknown): void;

    registerByList(listName: string, key: string, value: unknown): void;

    setRegisteredByList(listName: string, registered: TRegisterMap): void;

    getRegisteredByList<T extends TRegisterMap = TRegisterMap>(listName: string): T;

    getRegisteredList<T extends TRegisterMap = TRegisterMap>(): T;

    getRegisteredObject(): IRegsiterList;
}