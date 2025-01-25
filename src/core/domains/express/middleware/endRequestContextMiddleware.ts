import { App } from "@src/core/services/App";

import Middleware from "../base/Middleware";
import HttpContext from "../data/HttpContext";

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