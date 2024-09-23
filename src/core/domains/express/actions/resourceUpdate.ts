import Repository from '@src/core/base/Repository';
import ForbiddenResourceError from '@src/core/domains/auth/exceptions/ForbiddenResourceError';
import { SecurityIdentifiers } from '@src/core/domains/auth/services/Security';
import SecurityReader from '@src/core/domains/auth/services/SecurityReader';
import { IRouteResourceOptions } from '@src/core/domains/express/interfaces/IRouteResourceOptions';
import responseError from '@src/core/domains/express/requests/responseError';
import { RouteResourceTypes } from '@src/core/domains/express/routing/RouteResource';
import { BaseRequest } from "@src/core/domains/express/types/BaseRequest.t";
import ModelNotFound from '@src/core/exceptions/ModelNotFound';
import { IModel } from '@src/core/interfaces/IModel';
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
        const resourceOwnerSecurity = SecurityReader.findFromRouteResourceOptions(options, SecurityIdentifiers.RESOURCE_OWNER, RouteResourceTypes.UPDATE);
        
        const repository = new Repository(options.resource);

        const result = await repository.findById(req.params?.id);

        if (!result) {
            throw new ModelNotFound('Resource not found');
        }

        if(resourceOwnerSecurity && !resourceOwnerSecurity.callback(result)) {
            responseError(req, res, new ForbiddenResourceError(), 403)
            return;
        }

        result.fill(req.body);
        await result.save();

        res.send(result?.getData({ excludeGuarded: true }) as IModel);
    }
    catch (err) {
        if(err instanceof ModelNotFound) {
            responseError(req, res, err, 404)
            return;
        }
        if (err instanceof Error) {
            responseError(req, res, err)
            return;
        }

        res.status(500).send({ error: 'Something went wrong' })
    }
}