/* eslint-disable no-unused-vars */
import { IObserver } from "@src/core/domains/observer/interfaces/IObserver";
import { TClassConstructor } from "@src/core/interfaces/ClassConstructor.t";

export type ObserveConstructor = TClassConstructor<IObserver>;

export default interface IHasObserver {
    setObserverConstructor(observerConstructor: ObserveConstructor | undefined): void;
    getObserver(): IObserver | undefined;
    setObserveProperty(attribute: string, method: string): void;
}