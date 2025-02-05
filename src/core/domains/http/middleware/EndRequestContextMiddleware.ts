import HttpContext from "@src/core/domains/http/context/HttpContext";
import { App } from "@src/core/services/App";
import Middleware from "@src/core/domains/http/base/Middleware";

/**
 * Middleware that ends the current request context and removes all associated values.
 */
class EndRequestContextMiddleware extends Middleware {

    async execute(context: HttpContext): Promise<void> {
        context.getResponse().once('finish', () => {
            App.container('requestContext').endRequestContext(context.getRequest())
        })

        this.next()
    }

}

export default EndRequestContextMiddleware