import { NextFunction, Response } from 'express';

import IAuthorizedRequest from '../../interfaces/IAuthorizedRequest';
import Auth from '../../services/Auth';
import UnauthorizedError from '../../exceptions/UnauthorizedError';
import ResponseError from '../requests/ResponseError';
import User from '../../../app/models/User';
import UserRepository from '../../../app/repositories/UserRepository';

export const authorize = (repository: new () => UserRepository) => async (req: IAuthorizedRequest<User>, res: Response, next: NextFunction): Promise<void> => {
    try {
        const authorization = (req.headers.authorization ?? '').replace('Bearer ', '');

        const apiToken = await Auth.getInstance().authenticateToken(authorization)
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