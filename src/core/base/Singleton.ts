import IService from "@src/core/interfaces/IService";

export default abstract class Singleton<Config extends Record<any,any> | null = null> implements IService {

    private static instances: Map<string, Singleton<any>> = new Map();

    protected config!: Config | null;

    constructor(config: Config | null = null) {
        this.config = config
    }

    public static getInstance<Service extends Singleton<any>,Config extends Record<any,any> | null>
    (this: new (config: any) => Service, config: Config | null = null): Service {
        const className = this.name

        if(!Singleton.instances.has(className)) {
            Singleton.instances.set(className, new this(config));
        }

        return Singleton.instances.get(className) as Service;
    }

    public static isInitialized<Service extends Singleton<any>>(this: new (config: any) => Service): boolean {
        const className = this.name
        return Singleton.instances.has(className);
    }

    public getConfig(): Config | null {
        return this.config; 
    }

}