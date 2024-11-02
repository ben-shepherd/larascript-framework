/* eslint-disable no-unused-vars */
export type TRegisterMap = Map<string, unknown>;

export interface IRegsiterList {
    [key: string]: TRegisterMap
};

export interface IHasRegisterableConcern
{
    register(key: string, value: unknown): void;

    registerByList(listName: string, key: string, value: unknown): void;

    setRegisteredByList(listName: string, registered: Map<string, unknown>): void;

    getRegisteredByList(listName: string): Map<unknown, unknown>;

    getRegisteredList(): TRegisterMap;

    getRegisteredObject(): IRegsiterList;
}