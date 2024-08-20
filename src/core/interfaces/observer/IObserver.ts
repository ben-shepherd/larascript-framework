export type IObserverEvent = keyof IObserver;

export interface IObserver<ReturnType = any> {
   creating(data: ReturnType): ReturnType;
   created(data: ReturnType): ReturnType;
   updating(data: ReturnType): ReturnType;
   updated(data: ReturnType): ReturnType;
   saving(data: ReturnType): ReturnType;
   saved(data: ReturnType): ReturnType;
   deleting(data: ReturnType): ReturnType;
   deleted(data: ReturnType): ReturnType;

   on(name: IObserverEvent, data: ReturnType): ReturnType;
   onCustom(customName: string, data: ReturnType): ReturnType;
}