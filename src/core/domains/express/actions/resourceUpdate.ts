import { IRouteResourceOptions } from '@src/core/domains/express/interfaces/IRouteResourceOptions';
import ResourceErrorService from '@src/core/domains/express/services/Resources/ResourceErrorService';
import ResourceUpdateService from '@src/core/domains/express/services/Resources/ResourceUpdateService';
import { BaseRequest } from "@src/core/domains/express/types/BaseRequest.t";
import { Response } from 'express';

/**
 * Updates a resource
 *
 * @param {BaseRequest} req - The request object
 * @param {Response} res - The response object
 * @param {IRouteResourceOptions} options - The options object
 * @returns {Promise<void>}
 */
export default async (req: BaseRequest, res: Response, options: IRouteResourceOptions): Promise<void> => {
    try {
        const resourceUpdateService = new ResourceUpdateService();
        await resourceUpdateService.handler(req, res, options);
    }
    catch (err) {
        ResourceErrorService.handleError(req, res, err)
    }
}