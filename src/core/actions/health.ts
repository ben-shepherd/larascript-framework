import { Request, Response } from 'express';
import { App } from '@src/core/services/App';

export default async (req: Request, res: Response) => {

    try {
        await App.container('mongodb').getDb().stats()
    }
    catch (error) {
        res.status(500).send({ error: 'Database connection failed' })
        return;
    }

    res.send('OK')
}