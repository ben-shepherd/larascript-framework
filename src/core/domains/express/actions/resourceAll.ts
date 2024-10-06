import { IRouteResourceOptions } from '@src/core/domains/express/interfaces/IRouteResourceOptions';
import responseError from '@src/core/domains/express/requests/responseError';
import { BaseRequest } from "@src/core/domains/express/types/BaseRequest.t";
import { Response } from 'express';

import ResourceAllService from '../services/Resources/ResourceAllService';


/**
 * Finds all records in the resource's repository
 *
 * @param {BaseRequest} req - The request object
 * @param {Response} res - The response object
 * @param {IRouteResourceOptions} options - The options object
 * @returns {Promise<void>}
 */
export default async (req: BaseRequest, res: Response, options: IRouteResourceOptions): Promise<void> => {
    try {
        const resourceAllService = new ResourceAllService();
        resourceAllService.handler(req, res, options);
    }
    catch (err) {
        if (err instanceof Error) {
            responseError(req, res, err)
            return;
        }

        res.status(500).send({ error: 'Something went wrong' })
    }
}