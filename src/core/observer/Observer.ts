import { IObserver } from "../interfaces/observer/IObserver";

export default abstract class Observer<ReturnType = any> implements IObserver<ReturnType>
{
    /**
     * Defined methods
     */
    creating?: (...args: any[]) => ReturnType;
    created?: (...args: any[]) => ReturnType;
    updating?: (...args: any[]) => ReturnType;
    updated?: (...args: any[]) => ReturnType;
    saving?: (...args: any[]) => ReturnType;
    saved?: (...args: any[]) => ReturnType;
    deleting?: (...args: any[]) => ReturnType;
    deleted?: (...args: any[]) => ReturnType;

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
    on(name: keyof IObserver, data: ReturnType): ReturnType {

        if(!this[name]) {
            return data
        }
        if(this.creating && name === 'creating') {
            return this.creating(data)
        }
        if(this.created && name === 'created') {
            return this.created(data)
        }
        if(this.updating && name === 'updating') {
            return this.updating(data)
        }
        if(this.updated && name === 'updated') {
            return this.updated(data)
        }
        if(this.saving && name === 'saving') {
            return this.saving(data)
        }
        if(this.saved && name === 'saved') {
            return this.saved(data)
        }
        if(this.deleting && name === 'deleting') {
            return this.deleting(data)
        }
        if(this.deleted && name === 'deleted') {
            return this.deleted(data)
        }


        return data
    }

    /**
     * Same 'on' logic but for custom methods not clearly defined
     * 
     * Example
     *      this.data = this.observer.onCustom('onPasswordChange', data)
     * 
     * @param customName name of the method
     * @param data data to be modified
     * @returns 
     */
    onCustom(customName: string, data: ReturnType): ReturnType {
        const i = customName as keyof IObserver<ReturnType>;
        if(this[i]) {

            const fn = this[i] as (...args: any[]) => ReturnType
            return fn(data)
        }
        return data
    }
}