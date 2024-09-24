import CurrentRequest from "@src/core/domains/express/services/CurrentRequest";
import { BaseRequest } from "@src/core/domains/express/types/BaseRequest.t";
import { NextFunction, Response } from "express";


/**
 * Middleware that ends the current request context and removes all associated values.
 */
const endCurrentRequestMiddleware = () => (req: BaseRequest, res: Response, next: NextFunction) => {

    res.once('finish', () => {
        console.log('CurrentReqest (before)', CurrentRequest.getInstance())
        CurrentRequest.end(req)
        console.log('CurrentReqest (after)', CurrentRequest.getInstance())
    })

    next()
}

export default endCurrentRequestMiddleware