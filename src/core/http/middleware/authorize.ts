import { NextFunction, Response } from 'express';

import User from '@src/app/models/auth/User';
import UnauthorizedError from '@src/core/domains/auth/exceptions/UnauthorizedError';
import IAuthorizedRequest from '@src/core/domains/auth/interfaces/IAuthorizedRequest';
import { App } from '@src/core/services/App';
import ResponseError from '../requests/ResponseError';

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
        if(error instanceof UnauthorizedError) {
            ResponseError(req, res, error, 401)
            return;
        }

        if(error instanceof Error) {
            ResponseError(req, res, error)
        }
    }
};