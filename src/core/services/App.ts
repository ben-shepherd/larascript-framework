import { AppSingleton, BaseSingleton } from '@ben-shepherd/larascript-core-bundle';
import { Providers } from '@src/config/providers.config';
import UninitializedContainerError from '@src/core/exceptions/UninitializedContainerError';
import KernelLegacy from '@src/core/Kernel';


/**
 * @module App
 * @description The App service allows you to access kernel containers and configure the app environment
 */
export const app = <K extends keyof Providers = keyof Providers>(name: K): Providers[K] => {
    return AppSingleton.container(name);
}

/**
 * Short hand for App.env()
 */
export const appEnv = (): string | undefined => AppSingleton.env();

/**
 * App service
 * Allows you to access kernel containers
 * and configure the app environment
 * @deprecated
 */
export class AppSingletonLegacy extends BaseSingleton {

    /**
     * Environment
     * The environment the app is running in
     */
    public env!: string;

    /**
     * Global values
     */
    protected values: Record<string, unknown> = {};

    /**
     * Sets a value
     * @param key The key of the value
     * @param value The value to set
     */
    public static setValue(key: string, value: unknown): void {
        this.getInstance().values[key] = value;
    }

    /**
     * Gets a value
     * @param key The key of the value to get
     */
    public static getValue<T>(key: string): T | undefined {
        return this.getInstance().values[key] as T;
    }

    /**
     * Sets a container
     * @param name The name of the container
     * @param container The container to set
     */
    public static setContainer<Name extends keyof Providers & string>(name: Name, container: Providers[Name]) {
        const kernel = KernelLegacy.getInstance();

        if (kernel.booted()) {
            throw new Error('Kernel is already booted');
        }
        if (!name || name === '') {
            throw new Error('Container name cannot be empty');
        }
        if (kernel.containers.has(name)) {
            throw new Error('Container already exists');
        }

        kernel.containers.set(name, container);
    }

    /**
     * Gets a container
     * @param name The name of the container
     * @returns The container if it exists, or throws an UninitializedContainerError if not
     */
    public static container<K extends keyof Providers = keyof Providers>(name: K): Providers[K] {
        const kernel = KernelLegacy.getInstance();

        if (!kernel.containers.has(name)) {
            throw new UninitializedContainerError(name as string)
        }

        return kernel.containers.get(name);
    }

    /**
     * Safely retrieves a container by its name.
     * Attempts to get the specified container from the kernel.
     * If the container is not initialized, it returns undefined.
     * Throws an error for other exceptions.
     *
     * @template K - The type of the container key.
     * @param {K} name - The name of the container to retrieve.
     * @returns {IContainers[K] | undefined} The container if found, otherwise undefined.
     * @throws {Error} If an unexpected error occurs.
     */
    public static safeContainer<K extends keyof Providers = keyof Providers>(name: K): Providers[K] | undefined {
        try {
            return this.container(name);
        }
        catch (err) {
            if (err instanceof UninitializedContainerError) {
                return undefined;
            }

            throw err
        }
    }

    /**
     * Checks if a container is ready.
     * A container is considered ready if it has been set using the setContainer method.
     * @template K - The type of the container key.
     * @param {K} name - The name of the container to check.
     * @returns {boolean} Whether the container is ready or not.
     */
    public static containerReady<K extends keyof Providers = keyof Providers>(name: K): boolean {
        return this.safeContainer(name) !== undefined
    }

    /**
     * Gets the environment
     * @returns The environment if set, or undefined if not
     */
    public static env(): string | undefined {
        return this.getInstance().env
    }

}
