import { NextFunction, Response } from 'express';

import User from '@src/app/models/auth/User';
import unauthorizedError from '@src/core/domains/auth/exceptions/UnauthorizedError';
import IAuthorizedRequest from '@src/core/domains/auth/interfaces/IAuthorizedRequest';
import responseError from '@src/core/http/requests/responseError';
import { App } from '@src/core/services/App';

export const authorize = () => async (req: IAuthorizedRequest<User>, res: Response, next: NextFunction): Promise<void> => {
    try {
        const authorization = (req.headers.authorization ?? '').replace('Bearer ', '');

        const apiToken = await App.container('auth').attemptAuthenticateToken(authorization)

        const userId = apiToken?.data?.userId;

        const user = userId && await App.container('auth').userRepository.findById(userId?.toString());

        req.user = user;
        next();
    }
    catch (error) {
        if(error instanceof unauthorizedError) {
            responseError(req, res, error, 401)
            return;
        }

        if(error instanceof Error) {
            responseError(req, res, error)
        }
    }
};