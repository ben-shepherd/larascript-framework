import { NextFunction, Response } from 'express';

import UnauthorizedError from '@src/core/domains/auth/exceptions/UnauthorizedError';
import IAuthorizedRequest from '@src/core/domains/auth/interfaces/IAuthorizedRequest';
import responseError from '@src/core/domains/express/requests/responseError';
import { App } from '@src/core/services/App';

export const authorize = () => async (req: IAuthorizedRequest, res: Response, next: NextFunction): Promise<void> => {
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