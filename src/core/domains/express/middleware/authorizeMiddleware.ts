import UnauthorizedError from '@src/core/domains/auth/exceptions/UnauthorizedError';
import AuthRequest from '@src/core/domains/auth/services/AuthRequest';
import responseError from '@src/core/domains/express/requests/responseError';
import { BaseRequest } from '@src/core/domains/express/types/BaseRequest.t';
import { NextFunction, Response } from 'express';

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
export const authorizeMiddleware = () => async (req: BaseRequest, res: Response, next: NextFunction): Promise<void> => {
    try {

        // Authorize the request
        // Parses the authorization header
        // If successful, attaches the user and apiToken to the request
        // and sets the user in the App
        await AuthRequest.attemptAuthorizeRequest(req);
        
        next();
    }
    catch (error) {
        if(error instanceof UnauthorizedError) {
            responseError(req, res, error, 401)
            return;
        }

        if(error instanceof Error) {
            responseError(req, res, error)
            return;
        }
    }
};