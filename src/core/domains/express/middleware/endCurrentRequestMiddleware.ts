import { BaseRequest } from "@src/core/domains/express/types/BaseRequest.t";
import { App } from "@src/core/services/App";
import { NextFunction, Response } from "express";


/**
 * Middleware that ends the current request context and removes all associated values.
 */
const endCurrentRequestMiddleware = () => (req: BaseRequest, res: Response, next: NextFunction) => {
    res.once('finish', () => {
        console.log('Request finished: ', App.container('currentRequest').getContext())
    
        App.container('currentRequest').endRequest(req)
    })

    next()
}

export default endCurrentRequestMiddleware