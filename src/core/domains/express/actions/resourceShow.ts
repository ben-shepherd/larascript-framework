import { IRouteResourceOptions } from '@src/core/domains/express/interfaces/IRouteResourceOptions';
import ResourceErrorService from '@src/core/domains/express/services/Resources/ResourceErrorService';
import ResourceShowService from '@src/core/domains/express/services/Resources/ResourceShowService';
import { BaseRequest } from "@src/core/domains/express/types/BaseRequest.t";
import { Response } from 'express';

/**
 * Finds a resource by id
 *
 * @param {BaseRequest} req - The request object
 * @param {Response} res - The response object
 * @param {IRouteResourceOptions} options - The options object
 * @returns {Promise<void>}
 */
export default async (req: BaseRequest, res: Response, options: IRouteResourceOptions): Promise<void> => {
    try {
        const resourceShowService = new ResourceShowService()
        await resourceShowService.handler(req, res, options)
    }
    catch (err) {
        ResourceErrorService.handleError(req, res, err)
    }
}