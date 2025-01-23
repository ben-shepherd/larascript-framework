import Singleton from "@src/core/base/Singleton";
import { App } from "@src/core/services/App";

import 'dotenv/config';
import { EnvironmentType } from "@src/core/consts/Environment";
import { IProvider } from "@src/core/interfaces/IProvider";

export type Containers = {
    [key: string]: any
}
export type KernelOptions = {
    withoutProvider?: string[]
}
export type KernelConfig = {
    environment: EnvironmentType;
    providers: IProvider[];
}

export default class Kernel extends Singleton<KernelConfig> {

    public containers: Map<keyof Containers, Containers[keyof Containers]> = new Map();

    public preparedProviders: string[] = [];

    public readyProviders: string[] = [];

    /**
     * Checks if the kernel has been booted
     *
     * @returns True if the kernel has been booted, false otherwise
     */
    public booted(): boolean {
        const definedProviders = this.config?.providers ?? []
        return definedProviders.length > 0 && this.readyProviders.length === definedProviders.length
    }

    /**
     * Boots the kernel
     *
     * @param config The configuration for the kernel
     * @param options Options for booting the kernel
     * @returns A promise that resolves when the kernel is booted
     * @throws {Error} If the kernel is already booted
     * @throws {Error} If the app environment is not set
     */
    public static async boot(config: KernelConfig, options: KernelOptions): Promise<void> {
        const kernel = Kernel.getInstance(config);
        const environment = kernel.config?.environment ?? null
        const providers = kernel.config?.providers ?? [] as IProvider[];
        const withoutProviders = options.withoutProvider ?? [];

        if (kernel.booted()) {
            throw new Error('Kernel is already booted');
        }

        if(!environment) {
            throw new Error('App environment is not set');
        }

        App.getInstance().env = environment

        for (const provider of providers) {
            if(withoutProviders.includes(provider.constructor.name)) {
                continue;
            }

            await provider.register();
        }

        for (const provider of providers) {
            if(withoutProviders.includes(provider.constructor.name)) {
                continue;
            }

            await provider.boot();
            kernel.preparedProviders.push(provider.constructor.name);
        }

        
        Kernel.getInstance().readyProviders = [...kernel.preparedProviders];
    }

    /**
     * Checks if a provider is ready.
     * A provider is considered ready if it has been both registered and booted.
     * @param providerName The name of the provider to check.
     * @returns Whether the provider is ready or not.
     */
    public static isProviderReady(providerName: string): boolean {
        return this.getInstance().preparedProviders.includes(providerName) 
            || this.getInstance().readyProviders.includes(providerName);
    }

}
