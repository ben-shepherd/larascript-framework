/* eslint-disable no-unused-vars */
export type IObserverEvent = keyof IObserver;

export interface IObserver<ReturnType = any> {
   creating(data: ReturnType): Promise<ReturnType>;
   created(data: ReturnType): Promise<ReturnType>;
   updating(data: ReturnType): Promise<ReturnType>;
   updated(data: ReturnType): Promise<ReturnType>;
   saving(data: ReturnType): Promise<ReturnType>;
   saved(data: ReturnType): Promise<ReturnType>;
   deleting(data: ReturnType): Promise<ReturnType>;
   deleted(data: ReturnType): Promise<ReturnType>;
   on(name: IObserverEvent, data: ReturnType): Promise<ReturnType>;
   onCustom(customName: string, data: ReturnType): Promise<ReturnType>;
}