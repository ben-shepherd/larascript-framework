import ResourceShowServiceLegacy from '@src/core/domains/express/services/ResourcesLegacy/ResourceShowService';
import { BaseRequest } from "@src/core/domains/express/types/BaseRequest.t";
import { Response } from 'express';

import { IRouteResourceOptionsLegacy } from '../interfaces/IRouteResourceOptionsLegacy';
import ResourceErrorService from '../services/ResourcesLegacy/ResourceErrorService';

/**
 * Finds a resource by id
 *
 * @param {BaseRequest} req - The request object
 * @param {Response} res - The response object
 * @param {IRouteResourceOptionsLegacy} options - The options object
 * @returns {Promise<void>}
 */
export default async (req: BaseRequest, res: Response, options: IRouteResourceOptionsLegacy): Promise<void> => {
    try {
        const resourceShowService = new ResourceShowServiceLegacy()
        await resourceShowService.handler(req, res, options)
    }
    catch (err) {
        ResourceErrorService.handleError(req, res, err)
    }
}