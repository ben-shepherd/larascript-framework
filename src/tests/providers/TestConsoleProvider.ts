import BaseProvider from "@src/core/base/Provider";
import WorkerCommand from "@src/core/domains/console/commands/WorkerCommand";
import ConsoleService from "@src/core/domains/console/service/ConsoleService";
import { App } from "@src/core/services/App";

class TestConsoleProvider extends BaseProvider {

    async register(): Promise<void> {
        console.log('Registering ConsoleProvider')

        const cnsl = new ConsoleService();
        const register = cnsl.register()
    
        register.registerAll([
            WorkerCommand
        ])
        
        App.setContainer('console', cnsl)  
    }

    async boot(): Promise<void> {}

}

export default TestConsoleProvider