import { ContainersTypeHelpers } from '@src/config/containers';
import Singleton from "../base/Singleton";
import IAppConfig from "../interfaces/IAppConfig";
import Kernel from "../kernel";

export class App extends Singleton<IAppConfig> {

    public static setContainer<Name extends keyof ContainersTypeHelpers & string>(name: Name, container: ContainersTypeHelpers[Name]) {
        Kernel.getInstance().setContainer(name, container)
    }

    public static container<K extends keyof ContainersTypeHelpers = keyof ContainersTypeHelpers>(name: K): ContainersTypeHelpers[K] {
        return Kernel.getInstance().getContainer(name);
    }

    public env(): string | undefined {
        return this.getConfig()?.environment;
    }
}