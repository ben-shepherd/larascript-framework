import AppService from "@src/app/services/AppService";
import BaseProvider from "@src/core/base/Provider";
import { App } from "@src/core/services/App";

class AppProvider extends BaseProvider {

    public async register(): Promise<void> {

        // Register the AppService in the App container
        // Usage example: app('app').getConfig()
        App.setContainer('app', new AppService(this.config));
    }

}

export default AppProvider;