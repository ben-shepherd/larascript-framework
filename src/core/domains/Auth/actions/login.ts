import { Request, Response } from 'express';

import UnauthorizedError from '../../../exceptions/UnauthorizedError';
import ResponseError from '../../../http/requests/ResponseError';
import Auth from '../../../services/Auth';

export default async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req?.body ?? {};
        let token;

        token = await Auth.getInstance().login(email, password);

        res.send({ success: true, token })
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