import { ContainersTypeHelpers } from "@src/config/app";
import Singleton from "../base/Singleton";
import IAppConfig from "../interfaces/IAppConfig";
import Kernel from "../kernel";

export class App extends Singleton<IAppConfig> {

    public static container<K extends keyof ContainersTypeHelpers = keyof ContainersTypeHelpers>(name: K): ContainersTypeHelpers[K] {
        return Kernel.getInstance().getContainer(name);
    }

    public env(): string | undefined {
        return this.getConfig()?.environment;
    }
}