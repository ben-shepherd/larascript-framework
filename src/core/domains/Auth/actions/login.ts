import { Request, Response } from 'express';

import unauthorizedError from '@src/core/domains/auth/exceptions/UnauthorizedError';
import responseError from '@src/core/domains/express/requests/responseError';
import { App } from '@src/core/services/App';

export default async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req?.body ?? {};
        let token;

        token = await App.container('auth').attemptCredentials(email, password);

        const user = await App.container('auth').userRepository.findOneByEmail(email);

        res.send({ 
            success: true,
            token,
            user: user?.getData({ excludeGuarded: true })
         })
    }
    catch (error) {
        if(error instanceof unauthorizedError) {
            res.status(401).send({ error: error.message },)
            return;
        }

        if(error instanceof Error) {
            responseError(req, res, error)
        }
    }
}