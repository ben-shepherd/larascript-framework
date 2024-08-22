import { IContainers } from '@src/config/containers';
import Singleton from '@src/core/base/Singleton';
import UninitializedContainerError from '@src/core/exceptions/UninitializedContainerError';
import IAppConfig from "@src/core/interfaces/IAppConfig";
import Kernel from "@src/core/Kernel";

export class App extends Singleton<IAppConfig> {

    public env!: string;

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

    public static container<K extends keyof IContainers = keyof IContainers>(name: K): IContainers[K] {
        const kernel = Kernel.getInstance();

        if(!kernel.containers.has(name)) {
            throw new UninitializedContainerError(name as string)
        }

        return kernel.containers.get(name);
    }

    public static env(): string | undefined {
        return this.getInstance().env
    }
}