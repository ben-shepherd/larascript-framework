import { IAppService } from "@src/app/interfaces/IAppService";
import Service from "@src/core/base/Service";

class AppService extends Service implements IAppService {

    public async boot(): Promise<void> {
        console.log('[AppService] Booting...');
    }

    /**
     * @returns The app configuration.
     * Usage: app('app').getConfig()
     */
    public getConfig() {
        return this.config;
    }

}

export default AppService