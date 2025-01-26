import { EnvironmentDevelopment } from "@src/core/consts/Environment";
import { App } from "@src/core/services/App";
import Middleware from "@src/core/domains/express/base/Middleware";
import HttpContext from "@src/core/domains/express/data/HttpContext";

/**
 * Middleware to log the request context
 */
class RequestContextLoggerMiddleware extends Middleware {

    async execute(context: HttpContext): Promise<void> {
        if(App.env() !== EnvironmentDevelopment) {
            this.next()
            return;
        }
    
        context.getResponse().once('finish', () => {        
            App.container('logger').info('requestContext: ', App.container('requestContext').getRequestContext())
            App.container('logger').info('ipContext: ', App.container('requestContext').getIpContext())
        })
    
        this.next()
    }

}


export default RequestContextLoggerMiddleware