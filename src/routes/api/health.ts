import { Request, Response } from 'express';

import MongoDB from '../../services/MongoDB';

export default (req: Request, res: Response) => {

    try {
        MongoDB.getInstance().getDatabase().collection('users').findOne({})
    }
    catch (error) {
        res.status(500).send({ error: 'Database connection failed' })
        return;
    }

    res.send({ success: true })
}