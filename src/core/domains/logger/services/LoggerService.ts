import { ILoggerService } from "@src/core/domains/logger/interfaces/ILoggerService";
import { app } from "@src/core/services/App";
import path from "path";
import winston, { format } from "winston";

/**
 * Shorthand to get the logger instance
 * @returns 
 */
export const logger = () => app('logger');

/**
 * Winston logger service
 */
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

        const formatPrintf = (info: winston.Logform.TransformableInfo) => {
            return `${info.timestamp} ${info.level}: ${info.message}`+(info.splat!==undefined?`${info.splat}`:" ")
        }

        const logger = winston.createLogger({
            level:'info',
            format: winston.format.combine(
                format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                format.printf(formatPrintf)
            ),
            transports: [
                new winston.transports.Console({ format: winston.format.printf(formatPrintf) }),
                new winston.transports.File({ filename: path.resolve('@src/../', 'storage/logs/larascript.log') })
            ]
        })

        this.logger = logger
    }

    /**
     * Returns the underlying winston logger instance.
     * @returns {winston.Logger}
     */
    getLogger() {
        return this.logger
    }

    /**
     * Logs an exception to the console with the 'error' log level.
     * @param {Error} err The exception to log.
     */
    exception(err: Error) {
        this.error(err.message, err.stack)
    }

    /**
     * Logs the given arguments to the console with the 'error' log level.
     * @param {...any[]} args The arguments to log to the console.
     */
    error(...args: any[]) {
        this.logger.error([...args])
    }
    
    /**
     * Logs the given arguments to the console with the 'help' log level.
     * @param {...any[]} args The arguments to log to the console.
     */
    help(...args: any[]) {
        this.logger.help([...args])
    }

    /**
     * Logs the given arguments to the console with the 'data' log level.
     * @param {...any[]} args The arguments to log to the console.
     */
    data(...args: any[]) {
        this.logger.data([...args])
    }

    /**
     * Logs the given arguments to the console with the 'info' log level.
     * @param {...any[]} args The arguments to log to the console.
     */
    info(...args: any[]) {
        this.logger.info([...args])
    }

    /**
     * Logs the given arguments to the console with the 'warn' log level.
     * @param {...any[]} args The arguments to log to the console.
     */
    warn(...args: any[]) {
        this.logger.warn([...args])
    }

    /**
     * Logs the given arguments to the console with the 'debug' log level.
     * @param {...any[]} args The arguments to log to the console.
     */
    debug(...args: any[]) {
        this.logger.debug([...args])
    }

    /**
     * Logs the given arguments to the console with the 'verbose' log level.
     * @param {...any[]} args The arguments to log to the console.
     */
    verbose(...args: any[]) {
        this.logger.verbose([...args])
    }
    
    /**
     * Outputs the given arguments directly to the console using the console transport.
     * @param {...any[]} args The arguments to output to the console.
     */
    console(...args: any[]) {
        const logger = winston.createLogger({
            level:'info',
            format: winston.format.json(),
            transports: [
                new winston.transports.Console({ format: winston.format.simple() })
            ]
        })

        logger.info([...args])
    }

}

export default LoggerService