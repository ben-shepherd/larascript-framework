import { EnvironmentDevelopment } from "@src/core/consts/Environment";
import Middleware from "@src/core/domains/http/base/Middleware";
import HttpContext from "@src/core/domains/http/context/HttpContext";
import { AppSingleton } from "@src/core/services/App";

/**
 * Middleware to log the request context
 */
class RequestContextLoggerMiddleware extends Middleware {

    async execute(context: HttpContext): Promise<void> {
        if (AppSingleton.env() !== EnvironmentDevelopment) {
            this.next()
            return;
        }

        context.getResponse().once('finish', () => {
            AppSingleton.container('logger').info('requestContext: ', AppSingleton.container('requestContext').getRequestContext())
            AppSingleton.container('logger').info('ipContext: ', AppSingleton.container('requestContext').getIpContext())
        })

        this.next()
    }

}


export default RequestContextLoggerMiddleware