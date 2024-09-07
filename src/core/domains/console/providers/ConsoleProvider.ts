import appConfig from "@src/config/app";
import BaseProvider from "@src/core/base/Provider";
import WorkerCommand from "@src/core/domains/console/commands/WorkerCommand";
import ConsoleService from "@src/core/domains/console/service/ConsoleService";
import { App } from "@src/core/services/App";

export default class ConsoleProvider extends BaseProvider {

    async register(): Promise<void> {
        this.log('Registering ConsoleProvider')

        const cnsl = new ConsoleService();
        const register = cnsl.register()

        /**
         * Register system provided commands
         */
        register.registerAll([
            WorkerCommand
        ])

        /**
         * Register commands from @src/config/app
         */
        register.registerAll(appConfig.commands)

        /**
         * Add the console service to the container
         */
        App.setContainer('console', cnsl)
    }

    async boot(): Promise<void> {}

}