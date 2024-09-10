import commandsConfig from "@src/config/commands";
import BaseProvider from "@src/core/base/Provider";
import ConsoleService from "@src/core/domains/console/service/ConsoleService";
import { App } from "@src/core/services/App";
import readline from 'readline';
import HelpCommand from "@src/core/domains/console/commands/HelpCommand";

export default class ConsoleProvider extends BaseProvider {

    /**
     * Register method
     * Called when the provider is being registered
     * Use this method to set up any initial configurations or services
     */
    async register(): Promise<void> {
        this.log('Registering ConsoleProvider');

        /**
         * Add readline to the container
         * Prevents issue: 
         *  MaxListenersExceededWarning: Possible EventEmitter memory leak detected. 11 end listeners added to [Socket]
         */
        App.setContainer('readline', readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        }));
        
        /**
         * Add the console service to the container
         */
        App.setContainer('console', new ConsoleService())

        /**
         * Register internal commands
         */
        App.container('console').register().registerAll([
            HelpCommand
        ]);
        
        /**
         * Register commands from @src/config/app
         */
        App.container('console').register().registerAll(commandsConfig)
    }

    /**
     * Boot method
     * Called after all providers have been registered
     * Use this method to perform any actions that require other services to be available
     */
    async boot(): Promise<void> {}

}
