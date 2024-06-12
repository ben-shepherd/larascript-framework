import { IObserver } from "../interfaces/observer/IObserver";

export default abstract class Observer<ReturnType = any> implements IObserver<ReturnType>
{
    creating?: (...args: any[]) => ReturnType;
    created?: (...args: any[]) => ReturnType;
    updating?: (...args: any[]) => ReturnType;
    updated?: (...args: any[]) => ReturnType;
    saving?: (...args: any[]) => ReturnType;
    saved?: (...args: any[]) => ReturnType;
    deleting?: (...args: any[]) => ReturnType;
    deleted?: (...args: any[]) => ReturnType;

    onCustom(customName: string, data: ReturnType): ReturnType {
        console.log('[Observer:custom:1]', {customName, data})
        const customNameIndex = customName as keyof IObserver<ReturnType>;
        if(this[customNameIndex]) {
            const fn = this[customNameIndex] as (...args: any[]) => ReturnType
            console.log('[Observer:custom:2]', fn)
            return fn(data)
        }
        return data
    }

    on(name: keyof IObserver, data: ReturnType): ReturnType {
        console.log('[Observer:on]', {name, data})

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
}