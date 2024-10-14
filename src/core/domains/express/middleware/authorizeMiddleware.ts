import ForbiddenResourceError from '@src/core/domains/auth/exceptions/ForbiddenResourceError';
import UnauthorizedError from '@src/core/domains/auth/exceptions/UnauthorizedError';
import AuthRequest from '@src/core/domains/auth/services/AuthRequest';
import responseError from '@src/core/domains/express/requests/responseError';
import { BaseRequest } from '@src/core/domains/express/types/BaseRequest.t';
import { NextFunction, Response } from 'express';

/**
 * Validates that the scopes in the api token match the required scopes for the request.
 * If the scopes do not match, it will throw a ForbiddenResourceError.
 * If no api token is found, it will throw a UnauthorizedError.
 * @param scopes The scopes required for the request
 * @param req The request object
 * @param res The response object
 */
// eslint-disable-next-line no-unused-vars
const validateScopes = (scopes: string[], req: BaseRequest, res: Response): void | null => {
    if(scopes.length === 0) {
        return;
    }

    const apiToken = req.apiToken;

    if(!apiToken) {
        throw new UnauthorizedError();
    }
    
    if(!apiToken.hasScope(scopes)) {
        throw new ForbiddenResourceError();
    }
}

/**
 * Authorize middleware
 *
 * This middleware will check the authorization header for a valid JWT token.
 * If the token is valid, it will set the user and apiToken properties on the request.
 * If the token is invalid, it will throw a UnauthorizedError.
 *
 * @param {BaseRequest} req - The request object
 * @param {Response} res - The response object
 * @param {NextFunction} next - The next function
 * @returns {Promise<void>}
 */
export const authorizeMiddleware = (scopes: string[] = []) => async (req: BaseRequest, res: Response, next: NextFunction): Promise<void> => {
    try {

        // Authorize the request
        // Parses the authorization header
        // If successful, attaches the user and apiToken to the request
        // and sets the user in the App
        await AuthRequest.attemptAuthorizeRequest(req);
        
        // Validate the scopes if the authorization was successful
        validateScopes(scopes, req, res)

        next();
    }
    catch (error) {
        if(error instanceof UnauthorizedError) {
            responseError(req, res, error, 401)
            return;
        }

        if(error instanceof ForbiddenResourceError) {
            responseError(req, res, error, 403)
        }

        if(error instanceof Error) {
            responseError(req, res, error)
            return;
        }
    }
};