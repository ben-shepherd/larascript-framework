import IWithObserve, { IObserveWithCtor } from "../interfaces/observer/IObservable";
import { IObserver, IObserverEvent } from "../interfaces/observer/IObserver";

export abstract class WithObserver<ReturnType> implements IWithObserve<ReturnType> {

    public observer?: IObserver<ReturnType>;

    observeWith (observedBy: IObserveWithCtor<ReturnType>): void {
        if(this.observer) {
            throw new Error('Observer is already defined')
        }
        this.observer = new observedBy();
    }

    observeData (name: IObserverEvent, data: any): ReturnType {
        if(!this.observer) {
            return data
        }
        return this.observer.on(name, data)
    }

    observeDataCustom<Observer extends IObserver = IObserver>(customName: keyof Observer, data: any): ReturnType {
        if(!this.observer) {
            return data
        }
        return this.observer.onCustom(customName as string, data)
    }
}