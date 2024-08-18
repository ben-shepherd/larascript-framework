import { Request, Response } from 'express';

import { App } from '@src/core/services/App';

export default (req: Request , res: Response, err: Error, code: number = 500) => {
    if(App.env() === 'production') {
        res.status(code).send({ error: 'Something went wrong' })
        return;
    }

    console.error(err)
    res.status(code).send({ error: `Error: ${err.message}` })
}