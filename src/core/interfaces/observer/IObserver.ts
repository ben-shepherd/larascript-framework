export type IObserverEvent = keyof IObserver

export interface IObserver<ReturnType = any> {
   on(name: IObserverEvent, data: ReturnType): ReturnType;
   onCustom(customName: string, data: ReturnType): ReturnType;
   creating?: (...args: any[]) => ReturnType;
   created?: (...args: any[]) => ReturnType;
   updating?: (...args: any[]) => ReturnType;
   updated?: (...args: any[]) => ReturnType;
   saving?: (...args: any[]) => ReturnType;
   saved?: (...args: any[]) => ReturnType;
   deleting?: (...args: any[]) => ReturnType;
   deleted?: (...args: any[]) => ReturnType;
}