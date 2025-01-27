import ResourceDeleteService from '@src/core/domains/express/services/Resources/ResourceDeleteService';
import ResourceErrorService from '@src/core/domains/express/services/Resources/ResourceErrorService';
import { BaseRequest } from "@src/core/domains/express/types/BaseRequest.t";
import { Response } from 'express';

import { IRouteResourceOptionsLegacy } from '../interfaces/IRouteResourceOptionsLegacy';

/**
 * Deletes a resource
 *
 * @param {BaseRequest} req - The request object
 * @param {Response} res - The response object
 * @param {IRouteResourceOptionsLegacy} options - The options object
 * @returns {Promise<void>}
 */
export default async (req: BaseRequest, res: Response, options: IRouteResourceOptionsLegacy): Promise<void> => {
    try {
        const resourceDeleteService = new ResourceDeleteService();
        await resourceDeleteService.handler(req, res, options);
    }
    catch (err) {
        ResourceErrorService.handleError(req, res, err)
    }
}