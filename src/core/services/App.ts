import { IContainers } from '@src/config/containers';
import Singleton from '@src/core/base/Singleton';
import UninitializedContainerError from '@src/core/exceptions/UninitializedContainerError';
import IAppConfig from "@src/core/interfaces/IAppConfig";
import Kernel from '@src/core/Kernel';

/**
 * App service
 * Allows you to access kernel containers
 * and configure the app environment
 */

export class App extends Singleton<IAppConfig> {

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
    public static setContainer<Name extends keyof IContainers & string>(name: Name, container: IContainers[Name]) {
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

    /**
     * Gets a container
     * @param name The name of the container
     * @returns The container if it exists, or throws an UninitializedContainerError if not
     */
    public static container<K extends keyof IContainers = keyof IContainers>(name: K): IContainers[K] {
        const kernel = Kernel.getInstance();

        if(!kernel.containers.has(name)) {
            throw new UninitializedContainerError(name as string)
        }

        return kernel.containers.get(name);
    }

    /**
     * Gets the environment
     * @returns The environment if set, or undefined if not
     */
    public static env(): string | undefined {
        return this.getInstance().env
    }

}
