import Repository from '@src/core/base/Repository';
import ForbiddenResourceError from '@src/core/domains/auth/exceptions/ForbiddenResourceError';
import UnauthorizedError from '@src/core/domains/auth/exceptions/UnauthorizedError';
import { IRouteResourceOptions } from '@src/core/domains/express/interfaces/IRouteResourceOptions';
import responseError from '@src/core/domains/express/requests/responseError';
import { RouteResourceTypes } from '@src/core/domains/express/routing/RouteResource';
import { ALWAYS, SecurityIdentifiers } from '@src/core/domains/express/services/Security';
import SecurityReader from '@src/core/domains/express/services/SecurityReader';
import { BaseRequest } from "@src/core/domains/express/types/BaseRequest.t";
import ModelNotFound from '@src/core/exceptions/ModelNotFound';
import { Response } from 'express';

/**
 * Deletes a resource
 *
 * @param {BaseRequest} req - The request object
 * @param {Response} res - The response object
 * @param {IRouteResourceOptions} options - The options object
 * @returns {Promise<void>}
 */
export default async (req: BaseRequest, res: Response, options: IRouteResourceOptions): Promise<void> => {
    try {
        const resourceOwnerSecurity = SecurityReader.findFromRouteResourceOptions(options, SecurityIdentifiers.RESOURCE_OWNER, [RouteResourceTypes.DESTROY]);
        const authorizationSecurity = SecurityReader.findFromRouteResourceOptions(options, SecurityIdentifiers.AUTHORIZATION, [RouteResourceTypes.DESTROY, ALWAYS]);

        if(authorizationSecurity && !authorizationSecurity.callback(req)) {
            responseError(req, res, new UnauthorizedError(), 401)
            return;
        }
        const repository = new Repository(options.resource);

        const result = await repository.findById(req.params?.id);

        if (!result) {
            throw new ModelNotFound('Resource not found');
        }

        if(resourceOwnerSecurity && !resourceOwnerSecurity.callback(req, result)) {
            responseError(req, res, new ForbiddenResourceError(), 403)
            return;
        }

        await result.delete();

        res.send({ success: true })
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