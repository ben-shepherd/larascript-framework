import ResourceErrorService from '@src/core/domains/express/services/Resources/ResourceErrorService';
import ResourceShowService from '@src/core/domains/express/services/Resources/ResourceShowService';
import { BaseRequest } from "@src/core/domains/express/types/BaseRequest.t";
import { Response } from 'express';

import { IRouteResourceOptionsLegacy } from '../interfaces/IRouteResourceOptionsLegacy';

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
        const resourceShowService = new ResourceShowService()
        await resourceShowService.handler(req, res, options)
    }
    catch (err) {
        ResourceErrorService.handleError(req, res, err)
    }
}