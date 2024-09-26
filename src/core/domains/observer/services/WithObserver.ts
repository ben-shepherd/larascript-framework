import { IObserver, IObserverEvent } from "@src/core/domains/observer/interfaces/IObserver";
import IWithObserve, { ObserveConstructor } from "@src/core/domains/observer/interfaces/IWithObserve";

/**
 * Base class for models to inherit from to gain observer capabilities.
 * Models extending this class can use the observeWith method to attach an observer
 * and use the observeData and observeDataCustom methods to call observer events.
 */
export abstract class WithObserver<ReturnType> implements IWithObserve<ReturnType> {

    /**
     * The observer instance attached to this model.
     * If not set, observeWith must be called to define it.
     */
    public observer?: IObserver<ReturnType>;

    /**
     * Attatch the Observer to this instance
     * @param observedBy The constructor of the observer to attach.
     * @throws {Error} If the observer is already attached.
     */
    observeWith (observedBy: ObserveConstructor<ReturnType>): void {
        if(this.observer) {
            throw new Error('Observer is already defined')
        }
        this.observer = new observedBy();
    }

    /**
     * Data has changed
     * Pass it through the appropriate method, return the data
     * 
     * Example
     *      this data = this.observer.on('updating', data)
     * 
     * @param name The name of the event to call on the observer.
     * @param data The data associated with the event.
     * @returns The processed data, or the original data if no observer is defined.
     */
    async observeData (name: IObserverEvent, data: any): Promise<ReturnType> {
        if(!this.observer) {
            return data
        }
        return await this.observer.on(name, data)
    }

    /**
     * A custom observer method
     * 
     * Example: 
     *      this.data = this.observeDataCustom('onPasswordChanged', this.data)
     * 
     * @param customName The name of the custom event to call on the observer.
     * @param data The data associated with the event.
     * @returns The processed data, or the original data if no observer is defined.
     */
    async observeDataCustom(customName: keyof IObserver, data: any): Promise<ReturnType> {
        if(!this.observer) {
            return data
        }
        return this.observer.onCustom(customName as string, data)
    }

}
