import appConfig from "@src/config/app";
import BaseProvider from "@src/core/base/Provider";
import ConsoleService from "@src/core/domains/console/service/ConsoleService";
import { App } from "@src/core/services/App";

export default class ConsoleProvider extends BaseProvider {

    async register(): Promise<void> {
        this.log('Registering ConsoleProvider')

        /**
         * Add the console service to the container
         */
        App.setContainer('console', new ConsoleService())

        /**
         * Register commands from @src/config/app
         */
        App.container('console').register().registerAll(appConfig.commands)
    }

    async boot(): Promise<void> {}

}