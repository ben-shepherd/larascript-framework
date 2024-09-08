import { IObserver, IObserverEvent } from "@src/core/domains/observer/interfaces/IObserver";
import IWithObserve, { ObserveConstructor } from "@src/core/domains/observer/interfaces/IWithObserve";

export abstract class WithObserver<ReturnType> implements IWithObserve<ReturnType> {

    public observer?: IObserver<ReturnType>;

    /**
     * Attatch the Observer to this instance
     * @param observedBy 
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
     * @param name 
     * @param data 
     * @returns 
     */
    observeData (name: IObserverEvent, data: any): ReturnType {
        if(!this.observer) {
            return data
        }
        return this.observer.on(name, data)
    }

    /**
     * A custom observer method
     * 
     * Example: 
     *      this.data = this.observeDataCustom<UserObserver>('onPasswordChanged', this.data)
     * 
     * @param customName 
     * @param data 
     * @returns 
     */
    observeDataCustom<Observer extends IObserver = IObserver>(customName: keyof Observer, data: any): ReturnType {
        if(!this.observer) {
            return data
        }
        return this.observer.onCustom(customName as string, data)
    }

}