import BaseProvider from "@src/core/base/Provider";
import LoggerService from "@src/core/domains/logger/services/LoggerService";

class LoggerProvider extends BaseProvider {

    async register(): Promise<void> {
        
        const loggerService = new LoggerService();

        // We will boot the logger here to provide it early for other providers
        loggerService.boot();

        // Bind the logger service to the container
        this.bind('logger', loggerService);
    
    }

}

export default LoggerProvider