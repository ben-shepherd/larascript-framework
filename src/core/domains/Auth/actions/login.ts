import { Request, Response } from 'express';

import UnauthorizedError from '../../../exceptions/UnauthorizedError';
import ResponseError from '../../../http/requests/ResponseError';
import Auth from '../services/Auth';

export default async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req?.body ?? {};
        let token;

        token = await Auth.getInstance().attemptCredentials(email, password);

        const user = await Auth.getInstance().userRepository.findByEmail(email);

        // LoginEvent.dispatch({ user: user })

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