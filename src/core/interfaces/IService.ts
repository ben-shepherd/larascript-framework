export type ServiceConstructor<T extends IService = IService> = new (...args: any[]) => T;

export default interface IService {
    getConfig(...args: any[]): any;
}