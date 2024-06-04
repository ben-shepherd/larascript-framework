import appConfig from "./config/app";
import IAppConfig from "./interfaces/IAppConfig";


export default class Kernel {
    private static instance: Kernel;
    private appConfig: IAppConfig;

    private constructor() {
        this.appConfig = appConfig;
    }

    public static getInstance() {
        if (!Kernel.instance) {
            Kernel.instance = new Kernel();
        }
        return new Kernel();
    }

    public static async boot(): Promise<void> {
        await this.providers();
    }

    public static async providers() {
        const { appConfig} = this.getInstance();

        for(const provider of appConfig.providers) {
            await provider.register();
        }

        for(const provider of appConfig.providers) {
            await provider.boot();
        }
    }
}