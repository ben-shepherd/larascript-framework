import { BaseRequest } from "@src/core/domains/express/types/BaseRequest.t";
import { App } from "@src/core/services/App";
import { NextFunction, Response } from "express";



/**
 * Middleware that ends the current request context and removes all associated values.
 */
const endRequestContextMiddleware = () => (req: BaseRequest, res: Response, next: NextFunction) => {
    res.once('finish', () => {
        App.container('requestContext').endRequestContext(req)
    })

    next()
}

export default endRequestContextMiddleware