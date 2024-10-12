import { EnvironmentDevelopment } from "@src/core/consts/Environment";
import { BaseRequest } from "@src/core/domains/express/types/BaseRequest.t";
import { App } from "@src/core/services/App";
import { NextFunction, Response } from "express";

/**
 * Middleware to log the request context
 */
const requestContextLoggerMiddleware = () => (req: BaseRequest, res: Response, next: NextFunction) => {

    if(App.env() !== EnvironmentDevelopment) {
        next()
        return;
    }

    res.once('finish', () => {        
        App.container('logger').info('requestContext: ', App.container('requestContext').getRequestContext())
        App.container('logger').info('ipContext: ', App.container('requestContext').getIpContext())
    })

    next()
}

export default requestContextLoggerMiddleware