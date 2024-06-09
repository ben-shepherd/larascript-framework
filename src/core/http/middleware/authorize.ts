import { NextFunction, Response } from 'express';

import User from '../../../app/models/User';
import UserRepository from '../../../app/repositories/UserRepository';
import BaseAuth from '../../domains/auth/services/Auth';
import UnauthorizedError from '../../exceptions/UnauthorizedError';
import IAuthorizedRequest from '../../interfaces/IAuthorizedRequest';
import ResponseError from '../requests/ResponseError';

export const authorize = (repository: new () => UserRepository) => async (req: IAuthorizedRequest<User>, res: Response, next: NextFunction): Promise<void> => {
    try {
        const authorization = (req.headers.authorization ?? '').replace('Bearer ', '');

        const apiToken = await BaseAuth.getInstance().attemptAuthenticateToken(authorization)
        const userRepository = new repository();

        const userId = apiToken?.data?.userId;

        const user = userId && await userRepository.findById(userId?.toString());

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