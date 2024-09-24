import Repository from '@src/core/base/Repository';
import ForbiddenResourceError from '@src/core/domains/auth/exceptions/ForbiddenResourceError';
import { IRouteResourceOptions } from '@src/core/domains/express/interfaces/IRouteResourceOptions';
import responseError from '@src/core/domains/express/requests/responseError';
import { RouteResourceTypes } from '@src/core/domains/express/routing/RouteResource';
import { BaseRequest } from "@src/core/domains/express/types/BaseRequest.t";
import ModelNotFound from '@src/core/exceptions/ModelNotFound';
import { IModel } from '@src/core/interfaces/IModel';
import { Response } from 'express';

import UnauthorizedError from '../../auth/exceptions/UnauthorizedError';
import MissingSecurityError from '../exceptions/MissingSecurityError';
import { ALWAYS, SecurityIdentifiers } from '../services/Security';
import SecurityReader from '../services/SecurityReader';

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
        const resourceOwnerSecurity = SecurityReader.findFromRouteResourceOptions(options, SecurityIdentifiers.RESOURCE_OWNER, [RouteResourceTypes.UPDATE]);
        const authorizationSecurity = SecurityReader.findFromRouteResourceOptions(options, SecurityIdentifiers.AUTHORIZATION, [RouteResourceTypes.UPDATE, ALWAYS]);

        if(authorizationSecurity && !authorizationSecurity.callback(req)) {
            responseError(req, res, new UnauthorizedError(), 401)
            return;
        }
        const repository = new Repository(options.resource);

        const result = await repository.findById(req.params?.id);

        if (!result) {
            throw new ModelNotFound('Resource not found');
        }

        if(resourceOwnerSecurity && !authorizationSecurity) {
            responseError(req, res, new MissingSecurityError('Expected authorized security for this route, recieved: ' + typeof authorizationSecurity), 401);
        }

        if(resourceOwnerSecurity && !resourceOwnerSecurity.callback(req, result)) {
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