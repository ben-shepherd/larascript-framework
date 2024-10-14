/* eslint-disable no-unused-vars */
import { IObserver, IObserverEvent } from "@src/core/domains/observer/interfaces/IObserver";

export type ObserveConstructor<ReturnType> = new () => IObserver<ReturnType>

export default interface IWithObserve<ReturnType = any, ObserverType = IObserver<ReturnType>> {

    /**
     * Observer instance
     */
    observer?: ObserverType;

    /**
     * Register an instance of an Observer
     * [usage]
     *      [class extends IWithObserve].observeWith(MyObserver)
     */
    observeWith?: (observedBy: ObserveConstructor<ReturnType>) => any;

    /**
     * Call an observer event method
     * [usage]
     *      [class extends IWithObserve].observer.on('updating', data)
     */
    observeData(name: IObserverEvent, data: any): Promise<ReturnType>;

    /**
     * Call an observer event method
     * [usage]
     *      [class extends IWithObserve].observer.onCustom('someCustomMethod', data)
     */
    observeDataCustom?<Observer extends IObserver>(customName: keyof Observer, data: any): Promise<ReturnType>;
}