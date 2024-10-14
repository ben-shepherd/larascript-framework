import BaseProvider from "@src/core/base/Provider";
import LoggerService from "@src/core/domains/logger/services/LoggerService";
import { App } from "@src/core/services/App";

class LoggerProvider extends BaseProvider {

    async register(): Promise<void> {
        
        const loggerService = new LoggerService();

        // We will boot the logger here to provide it early for other providers
        loggerService.boot();

        App.setContainer('logger', loggerService);
    
    }

    async boot(): Promise<void> {}

}

export default LoggerProvider