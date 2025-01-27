import ResourceAllServiceLegacy from '@src/core/domains/express/services/ResourcesLegacy/ResourceAllService';
import ResourceErrorService from '@src/core/domains/express/services/ResourcesLegacy/ResourceErrorService';
import { BaseRequest } from "@src/core/domains/express/types/BaseRequest.t";
import { Response } from 'express';

import { IRouteResourceOptionsLegacy } from '../interfaces/IRouteResourceOptionsLegacy';

/**
 * Finds all records in the resource's repository
 *
 * @param {BaseRequest} req - The request object
 * @param {Response} res - The response object
 * @param {IRouteResourceOptionsLegacy} options - The options object
 * @returns {Promise<void>}
 */
export default async (req: BaseRequest, res: Response, options: IRouteResourceOptionsLegacy): Promise<void> => {
    try {
        const resourceAllService = new ResourceAllServiceLegacy();
        await resourceAllService.handler(req, res, options);
    }
    catch (err) {
        ResourceErrorService.handleError(req, res, err)
    }
}