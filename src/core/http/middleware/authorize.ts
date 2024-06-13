import { NextFunction, Response } from 'express';

import { App } from '@src/core/services/App';
import User from '../../../app/models/auth/User';
import UnauthorizedError from '../../exceptions/UnauthorizedError';
import IAuthorizedRequest from '../../interfaces/IAuthorizedRequest';
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