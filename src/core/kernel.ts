import Singleton from "./base/Singleton";
import IAppConfig from "./interfaces/IAppConfig";

export type Containers = {
    [key: string]: any
}

export default class Kernel<Config extends IAppConfig> extends Singleton<Config> {
    public className: string = 'Kernel';
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
}
