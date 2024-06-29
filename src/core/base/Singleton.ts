import IService from '../interfaces/IService';
import ISingleton from '../interfaces/ISingleton';

export default abstract class Singleton<ConfigType extends Record<any,any> | null = null> implements IService, ISingleton {
    private static instances: Map<string, Singleton<any>> = new Map();
    protected config!: ConfigType | null;
    public className!: string;

    constructor(config: ConfigType | null = null) {
        this.config = config
    }

    public static getInstance<
        TService extends Singleton<any>,
        TConfig extends Record<any,any> | null
    >
    (this: new (config: any) => TService, config: TConfig | null = null): TService 
    {
        const className = new this(null).className

        if(!className) {
            console.warn('[Singleton] Error Context', this)
            throw new Error('Invalid singleton. Missing property className')
        }

        if(!Singleton.instances.has(className)) {
            Singleton.instances.set(className, new this(config));
        }

        return Singleton.instances.get(className) as TService;
    }

    public static isInitialized<TService extends Singleton<any>>(this: new (config: any) => TService): boolean {
        const className = this.name
        return Singleton.instances.has(className);
    }

    public getConfig(): ConfigType | null {
        return this.config; 
    }
}