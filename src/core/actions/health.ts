import { App } from '@src/core/services/App';
import { Request, Response } from 'express';
import MongoDBDriver from '../domains/database/services/mongodb/MongoDBDriver';

export default async (req: Request, res: Response) => {

    try {
        const db = App.container('db');
        const dbDriver = db.driver();

        if(dbDriver instanceof MongoDBDriver) {
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