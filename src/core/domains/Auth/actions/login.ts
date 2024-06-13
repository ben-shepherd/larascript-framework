import { Request, Response } from 'express';

import UnauthorizedError from '@src/core/exceptions/UnauthorizedError';
import ResponseError from '@src/core/http/requests/ResponseError';
import { App } from '@src/core/services/App';

export default async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req?.body ?? {};
        let token;

        token = await App.container('auth').attemptCredentials(email, password);

        const user = await App.container('auth').userRepository.findByEmail(email);

        res.send({ 
            success: true,
            token,
            user: user?.getData({ excludeGuarded: true })
         })
    }
    catch (error) {
        if(error instanceof UnauthorizedError) {
            res.status(401).send({ error: error.message },)
            return;
        }

        if(error instanceof Error) {
            ResponseError(req, res, error)
        }
    }
}