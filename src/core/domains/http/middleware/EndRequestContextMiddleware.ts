import Middleware from "@src/core/domains/http/base/Middleware";
import HttpContext from "@src/core/domains/http/context/HttpContext";
import { app } from "@src/core/services/App";

/**
 * Middleware that ends the current request context and removes all associated values.
 */
class EndRequestContextMiddleware extends Middleware {

    /**
     * Executes the end request context middleware
     * 
     * @param context - The HTTP context containing request and response objects
     */
    async execute(context: HttpContext): Promise<void> {
        context.getResponse().once('finish', () => {
            app('requestContext').endRequestContext(context.getRequest())
        })

        this.next()
    }

}

export default EndRequestContextMiddleware