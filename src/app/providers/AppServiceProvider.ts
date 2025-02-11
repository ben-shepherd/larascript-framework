import AppService from "@src/app/services/AppService";
import BaseProvider from "@src/core/base/Provider";
import { app } from "@src/core/services/App";

class AppServiceProvider extends BaseProvider {

    public async register(): Promise<void> {

        // Register the AppService in the App container
        // Usage example: app('app').getConfig()
        this.bind('app', new AppService(this.config));
    }

    async boot(): Promise<void> {
        
        // Boot the app
        await app('app').boot();
    }

}

export default AppServiceProvider;