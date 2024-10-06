import Singleton from "@src/core/base/Singleton";
import IAppConfig from "@src/core/interfaces/IAppConfig";
import { App } from "@src/core/services/App";
import 'dotenv/config';

export type Containers = {
    [key: string]: any
}
export type KernelOptions = {
    withoutProvider?: string[]
}

export default class Kernel<Config extends IAppConfig> extends Singleton<Config> {

    private appConfig!: IAppConfig;

    public containers: Map<keyof Containers, Containers[keyof Containers]> = new Map();

    public preparedProviders: string[];

    public readyProviders: string[];

    constructor(appConfig: Config | null) {
        super(appConfig);
        this.readyProviders = this.preparedProviders = [];

        if(appConfig) {
            this.appConfig = appConfig;
        }
    }

    public booted(): boolean {
        return this.appConfig.providers.length > 0 && this.readyProviders.length === this.appConfig.providers.length
    }

    public static async boot<C extends IAppConfig>(config: C, options: KernelOptions): Promise<void> {
        const kernel = Kernel.getInstance(config);
        const withoutProviders = options.withoutProvider ?? [];

        if (kernel.booted()) {
            throw new Error('Kernel is already booted');
        }

        const { appConfig } = kernel;

        App.getInstance().env = appConfig.environment;

        for (const provider of appConfig.providers) {
            if(withoutProviders.includes(provider.constructor.name)) {
                continue;
            }

            await provider.register();
        }

        for (const provider of appConfig.providers) {
            if(withoutProviders.includes(provider.constructor.name)) {
                continue;
            }

            await provider.boot();
            kernel.preparedProviders.push(provider.constructor.name);
        }

        
        Kernel.getInstance().readyProviders = [...kernel.preparedProviders];
    }

    public static isProviderReady(providerName: string): boolean {
        return this.getInstance().preparedProviders.includes(providerName) || this.getInstance().readyProviders.includes(providerName);
    }

}
