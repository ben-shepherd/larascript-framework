import { Request, Response } from 'express';

import { App } from '../../services/App';
import Errors from '../../consts/Errors';

export default (req: Request , res: Response, err: Error, code: number = 500) => {
    if(App.getInstance().env() === 'production') {
        res.status(code).send({ error: Errors.InternalServerError })
        return;
    }

    res.status(code).send({ error: `Error: ${err.message}` })
}