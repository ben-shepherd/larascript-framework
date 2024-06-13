import { ContainersTypeHelpers } from '@src/config/containers';
import Singleton from "../base/Singleton";
import UninitializedContainerError from '../exceptions/UninitializedContainerError';
import IAppConfig from "../interfaces/IAppConfig";
import Kernel from "../kernel";

export class App extends Singleton<IAppConfig> {

    public static setContainer<Name extends keyof ContainersTypeHelpers & string>(name: Name, container: ContainersTypeHelpers[Name]) {
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

    public static container<K extends keyof ContainersTypeHelpers = keyof ContainersTypeHelpers>(name: K): ContainersTypeHelpers[K] {
        const kernel = Kernel.getInstance();

        if(!kernel.containers.has(name)) {
            throw new UninitializedContainerError(name as string)
        }
        return kernel.containers.get(name);

    }

    public env(): string | undefined {
        return this.getConfig()?.environment;
    }
}