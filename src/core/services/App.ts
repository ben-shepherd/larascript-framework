import Singleton from "../base/Singleton";
import IAppConfig from "../interfaces/IAppConfig";

export class App extends Singleton<IAppConfig> {
    public env(): string | undefined {
        return this.getConfig()?.environment;
    }
}