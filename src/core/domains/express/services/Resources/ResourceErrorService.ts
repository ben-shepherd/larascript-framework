import { EnvironmentDevelopment } from "@src/core/consts/Environment";
import ForbiddenResourceError from "@src/core/domains/auth/exceptions/ForbiddenResourceError";
import UnauthorizedError from "@src/core/domains/auth/exceptions/UnauthorizedError";
import ModelNotFound from "@src/core/exceptions/ModelNotFound";
import { App } from "@src/core/services/App";
import { Response } from "express";

import responseError from "../../requests/responseError";
import { BaseRequest } from "../../types/BaseRequest.t";

class ResourceErrorService {

    /**
     * Handles an error by sending an appropriate error response to the client.
     *
     * If the error is a ModelNotFound, it will be sent as a 404.
     * If the error is a ForbiddenResourceError, it will be sent as a 403.
     * If the error is an UnauthorizedError, it will be sent as a 401.
     * If the error is an Error, it will be sent as a 500.
     * If the error is anything else, it will be sent as a 500.
     *
     * @param req The Express Request object
     * @param res The Express Response object
     * @param err The error to handle
     */
    public static handleError(req: BaseRequest, res: Response, err: unknown):void {
        if(err instanceof ModelNotFound) {
            responseError(req, res, err, 404)
            return;
        }

        if(err instanceof ForbiddenResourceError) {
            responseError(req, res, err, 403)
            return;
        }

        if(err instanceof UnauthorizedError) {
            responseError(req, res, err, 401)
            return;
        }

        if (err instanceof Error) {
            responseError(req, res, err)
            return;
        }

        let error = 'Something went wrong.'

        if(App.env() === EnvironmentDevelopment) {
            error = (err as Error)?.message ?? error
        }

        res.status(500).send({ error })
    }

}

export default ResourceErrorService