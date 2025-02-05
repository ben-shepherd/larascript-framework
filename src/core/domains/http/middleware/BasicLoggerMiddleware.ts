import Middleware from '@src/core/domains/http/base/Middleware';
import HttpContext from '@src/core/domains/http/context/HttpContext';
import { logger } from '@src/core/domains/logger/services/LoggerService';

/**
 * BasicLoggerMiddleware logs basic information about incoming requests
 * 
 * This middleware:
 * - Logs the request method and URL
 * - Logs the request headers
 * - Logs the request body
 */
class BasicLoggerMiddleware extends Middleware {

    public async execute(context: HttpContext): Promise<void> {

        const detailed = {
            method: context.getRequest().method,
            url: context.getRequest().url,
            headers: context.getRequest().headers,
            body: context.getRequest().body,
            ip: context.getRequest().ip,
            userAgent: context.getRequest().headers['user-agent'],
        }

        logger().console('New request: ', detailed);
        this.next();
    }

}

export default BasicLoggerMiddleware;

