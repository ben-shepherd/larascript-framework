import IService from '../interfaces/IService';

export default class Singleton<TConfig extends Record<any,any> | null> implements IService {
    private static instances: Map<string, Singleton<any>> = new Map();
    protected config!: TConfig | null;

    constructor(config: TConfig | null = null) {
        this.config = config
    }

    public static getInstance<
        TService extends Singleton<any>,
        TConfig extends Record<any,any> | null
    >
    (this: new (config: any) => TService, config: TConfig | null = null): TService 
    {
        const className = this.name

        if(!Singleton.instances.has(className)) {
            Singleton.instances.set(className, new this(config));
        }

        return Singleton.instances.get(className) as TService;
    }

    public static isInitialized<TService extends Singleton<any>>(this: new (config: any) => TService): boolean {
        const className = this.name
        return Singleton.instances.has(className);
    }

    public getConfig(): TConfig | null {
        return this.config;
    }
}