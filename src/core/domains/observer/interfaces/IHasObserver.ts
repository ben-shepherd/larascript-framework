/* eslint-disable no-unused-vars */
import { IObserver } from "@src/core/domains/observer/interfaces/IObserver";
import { ICtor } from "@src/core/interfaces/ICtor";

export type ObserveConstructor = ICtor<IObserver>;

export default interface IHasObserver {
    setObserverConstructor(observerConstructor: ObserveConstructor | undefined): void;
    getObserver(): IObserver | undefined;
    setObserveProperty(attribute: string, method: string): void;
}