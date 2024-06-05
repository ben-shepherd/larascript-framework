import IService from '../interfaces/IService';

export default class BaseSingleton<TConfig extends Record<any,any> | null> implements IService {
    private static instances: Map<string, BaseSingleton<any>> = new Map();
    protected config!: TConfig | null;

    constructor(config: TConfig | null = null) {
        this.config = config
    }

    public static getInstance<TService extends BaseSingleton<any>, TConfig extends Record<any,any> | null>(this: new (config: any) => TService, config: TConfig | null = null): TService {
        const className = this.name

        if(!BaseSingleton.instances.has(className)) {
            BaseSingleton.instances.set(className, new this(config));
        }

        return BaseSingleton.instances.get(className) as TService;
    }

    public getConfig(): TConfig | null {
        return this.config;
    }
}