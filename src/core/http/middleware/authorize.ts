import { NextFunction, Response } from 'express';

import User from '../../../app/models/auth/User';
import Auth from '../../domains/auth/services/Auth';
import UnauthorizedError from '../../exceptions/UnauthorizedError';
import IAuthorizedRequest from '../../interfaces/IAuthorizedRequest';
import ResponseError from '../requests/ResponseError';

export const authorize = () => async (req: IAuthorizedRequest<User>, res: Response, next: NextFunction): Promise<void> => {
    try {
        const authorization = (req.headers.authorization ?? '').replace('Bearer ', '');

        const apiToken = await Auth.getInstance().attemptAuthenticateToken(authorization)

        const userId = apiToken?.data?.userId;

        const user = userId && await Auth.getInstance().userRepository.findById(userId?.toString());

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