import { NextFunction, Response } from 'express';

import UserRepository from '../../domains/Auth/repository/UserRepository';
import UnauthorizedError from '../../exceptions/UnauthorizedError';
import IAuthorizedRequest from '../../interfaces/IAuthorizedRequest';
import Auth from '../../services/Auth';

export const authorize = async (req: IAuthorizedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const authorization = (req.headers.authorization ?? '').replace('Bearer ', '');

        const apiToken = await Auth.getInstance().authenticateToken(authorization)
        const userRepository = new UserRepository();
        const user = await userRepository.findById(apiToken?.data?.userId);

        req.user = user;
        next();
    }
    catch (error) {
        if(error instanceof UnauthorizedError) {
            res.status(401).send({ error: error.message })
            return;
        }

        if(error instanceof Error) {
            res.status(500).send({ error: error.message })
        }
    }
};