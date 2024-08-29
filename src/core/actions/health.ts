import { App } from '@src/core/services/App';
import { Request, Response } from 'express';
import MongoDB from '@src/core/domains/database/drivers/MongoDB';

export default async (req: Request, res: Response) => {

    try {
        const db = App.container('db');
        const dbDriver = db.driver();

        if(dbDriver instanceof MongoDB) {
            await dbDriver.getDb().stats()
        }

    }
    catch (error) {
        console.error(error)
        res.status(500).send({ error: 'Database connection failed' })
        return;
    }

    res.send('OK')
}