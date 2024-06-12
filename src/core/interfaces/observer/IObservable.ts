import { IObserver, IObserverEvent } from "./IObserver";

export type IObserveWithCtor<ReturnType> = new () => IObserver<ReturnType>

export default interface IWithObserve<ReturnType = any, ObserverType = IObserver<ReturnType>> {
    observer?: ObserverType;
    observeWith?: (observedBy: IObserveWithCtor<ReturnType>) => any;
    observeData(name: IObserverEvent, data: ReturnType): ReturnType;
    observeDataCustom?(customName: string, data: ReturnType): ReturnType;
    // observeData?: (name: IObserverEvent, data: ReturnType) => ReturnType;
    // observeData?: (name: IObserverEvent, customName: string, data: ReturnType) => ReturnType;
}