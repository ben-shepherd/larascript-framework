import BaseProvider from "@src/core/base/Provider";
import ConsoleService from "@src/core/domains/console/service/ConsoleService";
import { App } from "@src/core/services/App";

class TestConsoleProvider extends BaseProvider {

    async register(): Promise<void> {
        App.setContainer('console', new ConsoleService());
    }

    async boot(): Promise<void> { /* nothing to boot */ }

}

export default TestConsoleProvider