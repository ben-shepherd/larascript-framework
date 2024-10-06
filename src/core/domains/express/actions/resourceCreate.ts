import { IRouteResourceOptions } from '@src/core/domains/express/interfaces/IRouteResourceOptions';
import { BaseRequest } from "@src/core/domains/express/types/BaseRequest.t";
import { Response } from 'express';

import ResourceCreateService from '../services/Resources/ResourceCreateService';
import ResourceErrorService from '../services/Resources/ResourceErrorService';


/**
 * Creates a new instance of the model
 *
 * @param {BaseRequest} req - The request object
 * @param {Response} res - The response object
 * @param {IRouteResourceOptions} options - The options object
 * @returns {Promise<void>}
 */
export default async (req: BaseRequest, res: Response, options: IRouteResourceOptions): Promise<void> => {
    try {
        const resourceCreateService = new ResourceCreateService();
        resourceCreateService.handler(req, res, options);
    }
    catch (err) {
        ResourceErrorService.handleError(req, res, err)
    }
}