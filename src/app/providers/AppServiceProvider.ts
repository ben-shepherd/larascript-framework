import AppService from "@src/app/services/AppService";
import BaseProvider from "@src/core/base/Provider";
import { app } from "@src/core/services/App";

class AppServiceProvider extends BaseProvider {

    public async register(): Promise<void> {

        const appService = new AppService(this.config);

        this.bind('app', appService);
        this.bind('app.config', () => appService.getConfig());
    }

    async boot(): Promise<void> {
        await app('app').boot();
    }

}

export default AppServiceProvider;