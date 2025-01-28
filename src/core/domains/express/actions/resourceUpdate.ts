import ResourceErrorService from '@src/core/domains/express/services/ResourcesLegacy/ResourceErrorService';
import ResourceUpdateServiceLegacy from '@src/core/domains/express/services/ResourcesLegacy/ResourceUpdateService';
import { BaseRequest } from "@src/core/domains/express/types/BaseRequest.t";
import { Response } from 'express';
import { IRouteResourceOptionsLegacy } from '@src/core/domains/express/interfaces/IRouteResourceOptionsLegacy';

/**
 * Updates a resource
 *
 * @param {BaseRequest} req - The request object
 * @param {Response} res - The response object
 * @param {IRouteResourceOptionsLegacy} options - The options object
 * @returns {Promise<void>}
 */
export default async (req: BaseRequest, res: Response, options: IRouteResourceOptionsLegacy): Promise<void> => {
    try {
        const resourceUpdateService = new ResourceUpdateServiceLegacy();
        await resourceUpdateService.handler(req, res, options);
    }
    catch (err) {
        ResourceErrorService.handleError(req, res, err)
    }
}