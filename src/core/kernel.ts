import appConfig from "../config/app";
import Singleton from "./base/Singleton";
import IAppConfig from "./interfaces/IAppConfig";

export default class Kernel extends Singleton<null> {
    private appConfig: IAppConfig;
    public readyProviders: string[]

    constructor() {
        super(null)
        this.readyProviders = []
        this.appConfig = appConfig;
    }

    public static async boot(): Promise<void> {
        const kernel = Kernel.getInstance();

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