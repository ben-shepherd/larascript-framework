import { IAppService } from "@src/app/interfaces/IAppService";
import Service from "@src/core/base/Service";

class AppService extends Service implements IAppService {

    /**
     * @returns The app configuration.
     * Usage: app('app').getConfig()
     */
    public getConfig() {
        return this.config;
    }

}

export default AppService