import ResourceCreateServiceLegacy from '@src/core/domains/express/services/ResourcesLegacy/ResourceCreateService';
import ResourceErrorService from '@src/core/domains/express/services/ResourcesLegacy/ResourceErrorService';
import { BaseRequest } from "@src/core/domains/express/types/BaseRequest.t";
import { Response } from 'express';
import { IRouteResourceOptionsLegacy } from '@src/core/domains/express/interfaces/IRouteResourceOptionsLegacy';


/**
 * Creates a new instance of the model
 *
 * @param {BaseRequest} req - The request object
 * @param {Response} res - The response object
 * @param {IRouteResourceOptionsLegacy} options - The options object
 * @returns {Promise<void>}
 */
export default async (req: BaseRequest, res: Response, options: IRouteResourceOptionsLegacy): Promise<void> => {
    try {
        const resourceCreateService = new ResourceCreateServiceLegacy();
        await resourceCreateService.handler(req, res, options);
    }
    catch (err) {
        ResourceErrorService.handleError(req, res, err)
    }
}