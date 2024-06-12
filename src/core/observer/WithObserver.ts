import IWithObserve, { IObserveWithCtor } from "../interfaces/observer/IObservable";
import { IObserver, IObserverEvent } from "../interfaces/observer/IObserver";

export abstract class WithObserver<Data> implements IWithObserve<Data> {

    // Observer for life cycle events 
    public observer?: IObserver<Data>;

    /**
     * 
     * @param observedBy 
     */
    observeWith (observedBy: IObserveWithCtor<Data>): void {
        if(this.observer) {
            throw new Error('Observer is already defined')
        }
        this.observer = new observedBy();
    }

    /**
     * 
     * @param name 
     * @param data 
     * @returns 
     */
    observeData (name: IObserverEvent, data: Data): Data {
        if(!this.observer) {
            return data
        }
        return this.observer.on(name, data)
    }

}