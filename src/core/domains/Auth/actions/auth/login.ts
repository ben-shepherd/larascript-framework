import { Request, Response } from 'express';
import UnauthorizedError from '../../../../exceptions/UnauthorizedError';
import Auth from '../../../../services/Auth';
import ResponseError from '../../../../http/requests/ResponseError';

export default async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;
        let token;

        token = await Auth.getInstance().login(email, password);

        res.send({ success: true, token })
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
}