import UnauthorizedError from '@src/core/domains/auth/exceptions/UnauthorizedError';
import responseError from '@src/core/domains/express/requests/responseError';
import { BaseRequest } from '@src/core/domains/express/types/BaseRequest.t';
import { App } from '@src/core/services/App';
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
export const authorize = () => async (req: BaseRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const authorization = (req.headers.authorization ?? '').replace('Bearer ', '');

        const apiToken = await App.container('auth').attemptAuthenticateToken(authorization)

        const user = await apiToken?.user()

        if(!user || !apiToken) {
            throw new UnauthorizedError();
        }

        req.user = user;
        req.apiToken = apiToken

        next();
    }
    catch (error) {
        if(error instanceof UnauthorizedError) {
            responseError(req, res, error, 401)
            return;
        }

        if(error instanceof Error) {
            responseError(req, res, error)
        }
    }
};