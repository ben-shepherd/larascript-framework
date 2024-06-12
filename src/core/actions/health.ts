import { Request, Response } from 'express';
import MongoDB from '../domains/database/mongodb/services/MongoDB';

export default async (req: Request, res: Response) => {

    try {
        await MongoDB.getInstance().getDb().stats()
    }
    catch (error) {
        res.status(500).send({ error: 'Database connection failed' })
        return;
    }

    res.send('OK')
}