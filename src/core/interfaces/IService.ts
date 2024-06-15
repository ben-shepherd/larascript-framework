export type ServiceConstructor<
    Service extends IService = IService
> = new (...args: any[]) => Service;

export default interface IService {
    getConfig(...args: any[]): any;
}