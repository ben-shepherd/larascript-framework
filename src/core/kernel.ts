import { ContainersTypeHelpers } from '@src/config/ContainersTypeHelpers';
import Singleton from "./base/Singleton";
import UninitializedContainerError from "./exceptions/UninitializedContainerError";
import IAppConfig from "./interfaces/IAppConfig";

export type Containers = {
    [key: string]: any
}

export default class Kernel<Config extends IAppConfig> extends Singleton<Config> {
    private appConfig: IAppConfig;
    public containers: Map<keyof Containers, Containers[keyof Containers]> = new Map();

    public preparedProviders: string[];
    public readyProviders: string[];

    constructor(appConfig: Config) {
        super(appConfig);
        this.readyProviders = this.preparedProviders = [];
        this.appConfig = appConfig;
    }

    private booted(): boolean {
        return this.readyProviders.length === this.appConfig.providers.length
    }

    public static async boot<C extends IAppConfig>(config: C): Promise<void> {
        const kernel = Kernel.getInstance(config);

        if (kernel.booted()) {
            throw new Error('Kernel is already booted');
        }

        const { appConfig } = kernel;

        for (const provider of appConfig.providers) {
            await provider.register();
        }

        for (const provider of appConfig.providers) {
            await provider.boot();
            kernel.preparedProviders.push(provider.constructor.name);
        }

        Kernel.getInstance().readyProviders = [...kernel.preparedProviders];
    }

    public static isProviderReady(providerName: string): boolean {
        return this.getInstance().preparedProviders.includes(providerName) || this.getInstance().readyProviders.includes(providerName);
    }

    public setContainer<Name extends keyof ContainersTypeHelpers & string>(name: Name, container: ContainersTypeHelpers[Name]) {
        const kernel = Kernel.getInstance();

        if (kernel.booted()) {
            throw new Error('Kernel is already booted');
        }
        if (!name) {
            throw new Error('Container name cannot be empty');
        }
        if (kernel.containers.has(name)) {
            throw new Error('Container already exists');
        }

        kernel.containers.set(name, container);
    }

    public getContainer<Name extends keyof ContainersTypeHelpers = keyof ContainersTypeHelpers>(name: Name): ContainersTypeHelpers[Name] {
        if(!Kernel.getInstance().containers.has(name)) {
            throw new UninitializedContainerError(name as string)
        }
        return Kernel.getInstance().containers.get(name);
    }
}
