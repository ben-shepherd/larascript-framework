import BaseProvider from "@src/core/base/Provider";
import { App } from "@src/core/services/App";
import AppSetupCommand from "../commands/AppSetupCommand";

class SetupProvider extends BaseProvider
{
    async register(): Promise<void> {
        this.log('Registering SetupProvider');

        App.container('console').register().registerAll([
            AppSetupCommand
        ])
    }

    async boot(): Promise<void> {
        this.log('Booting SetupProvider');
    }
}

export default SetupProvider