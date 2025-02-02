import BaseProvider from "@src/core/base/Provider";
import MakeCmdCommand from "@src/core/domains/make/commands/MakeCmdCommand";
import MakeController from "@src/core/domains/make/commands/MakeControllerCommand";
import MakeListenerCommand from "@src/core/domains/make/commands/MakeListenerCommand";
import MakeMiddlewareCommand from "@src/core/domains/make/commands/MakeMiddlewareCommand";
import MakeMigrationCommand from "@src/core/domains/make/commands/MakeMigrationCommand";
import MakeModelCommand from "@src/core/domains/make/commands/MakeModelCommand";
import MakeObserverCommand from "@src/core/domains/make/commands/MakeObserverCommand";
import MakeProviderCommand from "@src/core/domains/make/commands/MakeProviderCommand";
import MakeRepositoryCommand from "@src/core/domains/make/commands/MakeRepositoryCommand";
import MakeRoutesCommand from "@src/core/domains/make/commands/MakeRoutesCommand";
import MakeSeederCommand from "@src/core/domains/make/commands/MakeSeederCommand";
import MakeServiceCommand from "@src/core/domains/make/commands/MakeServiceCommand";
import MakeSingletonCommand from "@src/core/domains/make/commands/MakeSingletonCommand";
import MakeSubscriberCommand from "@src/core/domains/make/commands/MakeSubscriberCommand";
import MakeValidatorCommand from "@src/core/domains/make/commands/MakeValidatorCommand";
import { App } from "@src/core/services/App";

export default class MakeProvider extends BaseProvider {

    async register(): Promise<void> {
        this.log('Registering MakeProvider')    

        App.container('console').register().registerAll([
            MakeCmdCommand,
            MakeListenerCommand,
            MakeModelCommand,
            MakeObserverCommand,
            MakeRepositoryCommand,
            MakeServiceCommand,
            MakeSingletonCommand,
            MakeSubscriberCommand,
            MakeProviderCommand,
            MakeRoutesCommand,
            MakeMiddlewareCommand,
            MakeController,
            MakeValidatorCommand,
            MakeMigrationCommand,
            MakeSeederCommand
        ])
    }

    async boot(): Promise<void> {}

}
