import Repository from '@src/core/base/Repository';
import UnauthorizedError from '@src/core/domains/auth/exceptions/UnauthorizedError';
import { SecurityIdentifiers } from '@src/core/domains/auth/services/Security';
import SecurityReader from '@src/core/domains/auth/services/SecurityReader';
import { IRouteResourceOptions } from '@src/core/domains/express/interfaces/IRouteResourceOptions';
import responseError from '@src/core/domains/express/requests/responseError';
import { RouteResourceTypes } from '@src/core/domains/express/routing/RouteResource';
import { BaseRequest } from "@src/core/domains/express/types/BaseRequest.t";
import ModelNotFound from '@src/core/exceptions/ModelNotFound';
import { IModel } from '@src/core/interfaces/IModel';
import { App } from '@src/core/services/App';
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
        const resourceOwnerSecurity = SecurityReader.findFromRouteResourceOptions(options, SecurityIdentifiers.RESOURCE_OWNER, RouteResourceTypes.SHOW);

        const repository = new Repository(options.resource);

        let result: IModel | null = null;
        
        /**
         * When a resourceOwnerSecurity is defined, we need to find the record that is owned by the user
         */
        if(resourceOwnerSecurity) {
            const propertyKey = resourceOwnerSecurity.arguements?.key;
            const userId = App.container('auth').user()?.getId();

            if(!userId) {
                responseError(req, res, new UnauthorizedError());
            }

            if(typeof propertyKey !== 'string') {
                throw new Error('Malformed resourceOwner security. Expected parameter \'key\' to be a string but received ' + typeof propertyKey);
            }

            result = await repository.findOne({
                id: req.params?.id,
                [propertyKey]: userId
            })

            if (!result) {
                throw new ModelNotFound('Resource not found');
            }

            res.send(result?.getData({ excludeGuarded: true }) as IModel);

            return;
        }
        
        /**
         * Find resource without restrictions
         */
        result = await repository.findById(req.params?.id);

        if (!result) {
            throw new ModelNotFound('Resource not found');
        }

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