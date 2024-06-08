import Singleton from "./base/Singleton";
import IAppConfig from "./interfaces/IAppConfig";

export default class Kernel<C extends IAppConfig> extends Singleton<C> {
    private appConfig: IAppConfig;
    public readyProviders: string[]

    constructor(appConfig: C) {
        super(appConfig)
        this.readyProviders = []
        this.appConfig = appConfig;
    }

    public static async boot<C extends IAppConfig>(config: C): Promise<void> {
        const kernel = Kernel.getInstance(config);


        if(kernel.readyProviders.length > 0) {
            throw new Error('Kernel is already booted');
        }

        const { appConfig } = kernel

        for(const provider of appConfig.providers) {
            await provider.register();
        }

        for(const provider of appConfig.providers) {
            await provider.boot();
            kernel.readyProviders.push(provider.constructor.name);
        }
    }

    public static isProviderReady(providerName: string): boolean {
        return this.getInstance().readyProviders.includes(providerName);
    }
}