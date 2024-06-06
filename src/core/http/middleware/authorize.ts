import { NextFunction, Response } from 'express';

import IAuthorizedRequest from '../../interfaces/IAuthorizedRequest';
import Auth from '../../services/Auth';
import BaseUserRepository from '../../domains/Auth/repository/BaseUserRepository';
import UnauthorizedError from '../../exceptions/UnauthorizedError';
import ResponseError from '../requests/ResponseError';

export const authorize = async (req: IAuthorizedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const authorization = (req.headers.authorization ?? '').replace('Bearer ', '');

        const apiToken = await Auth.getInstance().authenticateToken(authorization)
        const userRepository = new BaseUserRepository();
        const user = await userRepository.findById(apiToken?.data?.userId);

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