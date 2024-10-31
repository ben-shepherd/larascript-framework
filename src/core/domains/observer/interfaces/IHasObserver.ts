/* eslint-disable no-unused-vars */
import { IObserver, IObserverEvent } from "@src/core/domains/observer/interfaces/IObserver";

export type ObserveConstructor<ReturnType> = new () => IObserver<ReturnType>

export default interface IHasObserver<ReturnType = any, ObserverType = IObserver<ReturnType>> {

    /**
     * Observer instance
     */
    observer?: ObserverType;

    /**
     * Custom observation methods for specific properties.
     * Key is the property name, value is the name of the custom observation method.
     */
    observeProperties: Record<string, string>;

    /**
     * Register an instance of an Observer
     * [usage]
     *      [class extends IWithObserve].observeWith(MyObserver)
     */
    observeWith: (observedBy: ObserveConstructor<ReturnType>) => any;

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