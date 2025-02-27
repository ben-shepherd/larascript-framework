import Middleware from '@src/core/domains/http/base/Middleware';
import HttpContext from '@src/core/domains/http/context/HttpContext';
import { logger } from '@src/core/domains/logger/services/LoggerService';
import { app } from '@src/core/services/App';

/**
 * Middleware that logs detailed information about incoming HTTP requests
 * 
 * This middleware captures and logs essential request details including method, URL,
 * headers, body, IP address, and user agent. Logging can be enabled/disabled via
 * the HTTP service configuration.
 * 
 * @example
 * // In your http configuration:
 * globalMiddlewares: [
 *     new BasicLoggerMiddleware()
 * ]
 * 
 * @example
 * // Enable/disable in http config:
 * {
 *   logging: {
 *     requests: true // or false to disable
 *   }
 * }
 */
class BasicLoggerMiddleware extends Middleware {

    /**
     * Executes the logging middleware
     * 
     * Checks if request logging is enabled in the HTTP service configuration.
     * If enabled, logs detailed request information including:
     * - HTTP method
     * - Request URL
     * - Request headers
     * - Request body
     * - Client IP address
     * - User agent
     * 
     * @param context - The HTTP context containing request and response objects
     * @returns Promise<void>
     */
    public async execute(context: HttpContext): Promise<void> {

        const httpServiceConfig = app('http').getConfig()

        if(!httpServiceConfig?.logging?.requests) {
            this.next();
            return;
        }

        logger().console('New request: ', this.getRequestDetails(context));

        this.next();
    }

    /**
     * Gets the details of the request
     * @param context - The HTTP context containing request and response objects
     * @returns The details of the request
     */
    getRequestDetails(context: HttpContext) {
        return {
            method: context.getRequest().method,
            url: context.getRequest().url,
            headers: context.getRequest().headers,
            body: context.getRequest().body,
            ip: context.getRequest().ip,
            userAgent: context.getRequest().headers['user-agent'],
        }
    }

}

export default BasicLoggerMiddleware;

