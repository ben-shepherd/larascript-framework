import { Request, Response } from 'express';

import UnauthorizedError from '../../../exceptions/UnauthorizedError';
import Auth from '../../../services/Auth';

export default async (req: Request, res: Response): Promise<void> => {

    const { email, password } = req.body;
    let token;

    try {
        token = await Auth.getInstance().login(email, password);
    }
    catch (error) {
        if(error instanceof UnauthorizedError) {
            res.status(401).send({ error: error.message })
            return;
        }

        res.status(500).send({ error: 'Internal server error' })
    }
    
    res.send({ success: true, token })
}