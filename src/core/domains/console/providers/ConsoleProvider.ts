import appConfig from "@src/config/app";
import BaseProvider from "@src/core/base/Provider";
import { App } from "@src/core/services/App";
import CommandRegister from "../CommandRegister";
import HelpCommand from "../commands/HelpCommand";
import CommandService from "../service/CommandService";

export default class ConsoleProvider extends BaseProvider
{
    async register(): Promise<void> 
    {
        console.log('Registering ConsoleProvider')

        App.setContainer('console', new CommandService())
    }

    async boot(): Promise<void> 
    {
        console.log('Booting ConsoleProvider')

        const register = CommandRegister.getInstance()

        /**
         * Register system provided commands
         */
        register.registerAll(
            CommandRegister.buildRegisterParams([
                HelpCommand
            ])
        )

        /**
         * Register commands from @src/config/app
         */
        register.registerAll(
            CommandRegister.buildRegisterParams(appConfig.commands)
        )

        console.log('[ConsoleProvider]: Registered commands', CommandRegister.getInstance().getRegistered())
    }

}