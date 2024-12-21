import IService from "@src/core/interfaces/IService";

import { ICtor } from "../interfaces/ICtor";

/**
 * Singleton pattern implementation for services.
 *
 * @template Config - Type of the configuration object passed to the service.
 */
export default abstract class Singleton<Config extends Record<any,any> | null = null> implements IService {

    /**
     * Map of instantiated services.
     */
    private static instances: Map<string, Singleton<any>> = new Map();

    /**
     * Service configuration.
     */
    protected config!: Config | null;

    /**
     * Constructor.
     *
     * @param config - Service configuration.
     */
    constructor(config: Config | null = null) {
        this.config = config
    }

    /**
     * Returns the singleton instance of the service.
     *
     * @template Service - Type of the service.
     * @param this - The service class.
     * @param config - Service configuration.
     * @returns The singleton instance of the service.
     */
     
    public static getInstance<Service extends Singleton<any>,Config extends Record<any,any> | null> (this: ICtor<Service>, config: Config | null = null): Service {
        const className = this.name

        if(!Singleton.instances.has(className)) {
            Singleton.instances.set(className, new this(config));
        }

        return Singleton.instances.get(className) as Service;
    }

    /**
     * Checks if the singleton instance of the service is initialized.
     *
     * @template Service - Type of the service.
     * @param this - The service class.
     * @returns True if the service is initialized, false otherwise.
     */
    // eslint-disable-next-line no-unused-vars
    public static isInitialized<Service extends Singleton<any>>(this: new (config: any) => Service): boolean {
        const className = this.name
        return Singleton.instances.has(className);
    }

    /**
     * Returns the service configuration.
     *
     * @returns The service configuration.
     */
    public getConfig(): Config | null {
        return this.config; 
    }

}
