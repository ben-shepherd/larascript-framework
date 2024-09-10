import { Request, Response } from "express";
import { MongoClient } from "mongodb";
import { Sequelize } from "sequelize";

import MongoDB from "../domains/database/providers-db/MongoDB";
import Postgres from "../domains/database/providers-db/Postgres";
import responseError from "../domains/express/requests/responseError";
import { App } from "../services/App";

/**
 * Health check endpoint
 * 
 * This endpoint is used to check if the database connection is active
 * 
 * @param {Request} req
 * @param {Response} res
 */
export default async (req: Request, res: Response) => {

    try {
        const db = App.container('db');
        const provider = db.provider();
        const client = provider.getClient() as any;

        // Check if the provider is MongoDB
        if (provider as unknown instanceof MongoDB) {
            // Check if the MongoDB connection is active
            await (client as MongoClient).db().stats();
        }
        // Check if the provider is Postgres
        else if (provider as unknown instanceof Postgres) {
            // Check if the Postgres connection is active
            await (client as Sequelize).authenticate();
        }
    }
    catch (error) {
        console.error(error)
        // If there is an error, send the error response
        responseError(req, res, error as Error)
        return;
    }

    // If the database connection is active, send a success response
    res.send('OK')
}
