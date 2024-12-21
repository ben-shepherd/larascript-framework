import BaseProvider from "@src/core/base/Provider";
import AppSetupCommand from "@src/core/domains/setup/commands/AppSetupCommand";
import { App } from "@src/core/services/App";

class SetupProvider extends BaseProvider {

    async register(): Promise<void> {
        this.log('Registering SetupProvider');

        App.container('console').register().registerAll([
            AppSetupCommand
        ])
    }

}

export default SetupProvider