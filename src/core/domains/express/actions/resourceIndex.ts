import User from '@src/app/models/auth/User';
import Repository from '@src/core/base/Repository';
import UnauthorizedError from '@src/core/domains/auth/exceptions/UnauthorizedError';
import { IRouteResourceOptions } from '@src/core/domains/express/interfaces/IRouteResourceOptions';
import responseError from '@src/core/domains/express/requests/responseError';
import { RouteResourceTypes } from '@src/core/domains/express/routing/RouteResource';
import { BaseRequest } from "@src/core/domains/express/types/BaseRequest.t";
import { IModel } from '@src/core/interfaces/IModel';
import IModelData from '@src/core/interfaces/IModelData';
import { Response } from 'express';

import CurrentRequest from '../services/CurrentRequest';
import { ALWAYS, SecurityIdentifiers } from '../services/Security';
import SecurityReader from '../services/SecurityReader';

/**
 * Formats the results by excluding guarded properties
 * 
 * @param results 
 * @returns 
 */
const formatResults = (results: IModel<IModelData>[]) => results.map(result => result.getData({ excludeGuarded: true }) as IModel);

/**
 * Finds all records in the resource's repository
 *
 * @param {BaseRequest} req - The request object
 * @param {Response} res - The response object
 * @param {IRouteResourceOptions} options - The options object
 * @returns {Promise<void>}
 */
export default async (req: BaseRequest, res: Response, options: IRouteResourceOptions): Promise<void> => {
    try {
        const resourceOwnerSecurity = SecurityReader.findFromRouteResourceOptions(options, SecurityIdentifiers.RESOURCE_OWNER, [RouteResourceTypes.ALL])
        const authorizationSecurity = SecurityReader.findFromRouteResourceOptions(options, SecurityIdentifiers.AUTHORIZATION, [RouteResourceTypes.ALL, ALWAYS]);

        if(authorizationSecurity && !authorizationSecurity.callback(req)) {
            responseError(req, res, new UnauthorizedError(), 401)
            return;
        }
        
        console.log('resourceIndex CurrentRequest', CurrentRequest.getInstance())

        const repository = new Repository(options.resource);

        let results: IModel<IModelData>[] = [];

        /**
         * When a resourceOwnerSecurity is defined, we need to find all records that are owned by the user
         */
        if (resourceOwnerSecurity && authorizationSecurity) {

            const propertyKey = resourceOwnerSecurity.arguements?.key;
            const userId = CurrentRequest.get<User>(req, 'user')?.getId()

            if (!userId) {
                responseError(req, res, new UnauthorizedError(), 401);
                return;
            }

            if (typeof propertyKey !== 'string') {
                throw new Error('Malformed resourceOwner security. Expected parameter \'key\' to be a string but received ' + typeof propertyKey);
            }

            results = await repository.findMany({ [propertyKey]: userId })

            res.send(formatResults(results))
            return;
        }

        /**
         * Finds all results without any restrictions
         */
        results = await repository.findMany();

        res.send(formatResults(results))
    }
    catch (err) {
        if (err instanceof Error) {
            responseError(req, res, err)
            return;
        }

        res.status(500).send({ error: 'Something went wrong' })
    }
}