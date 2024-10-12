import { EnvironmentProduction } from "@src/core/consts/Environment";
import { App } from "@src/core/services/App";
import path from "path";
import winston from "winston";

import { ILoggerService } from "../interfaces/ILoggerService";

class LoggerService implements ILoggerService {

    /**
     * Winston logger instance
     */
    protected logger!: winston.Logger

    /**
     * Bootstraps the winston logger instance.
     * @returns {Promise<void>}
     */
    boot() {
        if(this.logger) {
            return;
        }

        const logger = winston.createLogger({
            level:'info',
            format: winston.format.json(),
            transports: [
                new winston.transports.File({ filename: path.resolve('@src/../', 'storage/logs/larascript.log') })
            ]
        })

        if(App.env() !== EnvironmentProduction) {
            logger.add(new winston.transports.Console({ format: winston.format.simple() }));
        }

        this.logger = logger
    }

    /**
     * Returns the underlying winston logger instance.
     * @returns {winston.Logger}
     */
    getLogger() {
        return this.logger
    }

    error(...args: any[]) {
        this.logger.error([...args])
    }
    
    help(...args: any[]) {
        this.logger.help([...args])
    }

    data(...args: any[]) {
        this.logger.data([...args])
    }

    info(...args: any[]) {
        this.logger.info([...args])
    }

    warn(...args: any[]) {
        this.logger.warn([...args])
    }

    debug(...args: any[]) {
        this.logger.debug([...args])
    }

    verbose(...args: any[]) {
        this.logger.verbose([...args])
    }
    
}

export default LoggerService