/* eslint-disable no-unused-vars */
import { IHasRegisterableConcern, IRegsiterList, TRegisterMap } from "@src/core/interfaces/concerns/IHasRegisterableConcern";

export interface IBaseDatabase extends IHasRegisterableConcern
{
    register(key: string, value: unknown): void;

    registerByList(listName: string, key: string, value: unknown): void;

    setRegisteredByList(listName: string, registered: TRegisterMap): void;

    getRegisteredByList<T extends TRegisterMap = TRegisterMap>(listName: string): T;

    getRegisteredList<T extends TRegisterMap = TRegisterMap>(): T;

    getRegisteredObject(): IRegsiterList;

    isRegisteredInList(listName: string, key: string): boolean;
}