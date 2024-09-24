import User from '@src/app/models/auth/User';
import { IRouteResourceOptions } from '@src/core/domains/express/interfaces/IRouteResourceOptions';
import responseError from '@src/core/domains/express/requests/responseError';
import { BaseRequest } from "@src/core/domains/express/types/BaseRequest.t";
import { Response } from 'express';

import UnauthorizedError from '../../auth/exceptions/UnauthorizedError';
import { ALWAYS, SecurityIdentifiers } from '../../auth/services/Security';
import SecurityReader from '../../auth/services/SecurityReader';
import MissingSecurityError from '../exceptions/MissingSecurityError';
import { RouteResourceTypes } from '../routing/RouteResource';
import CurrentRequest from '../services/CurrentRequest';


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
        const resourceOwnerSecurity = SecurityReader.findFromRouteResourceOptions(options, SecurityIdentifiers.RESOURCE_OWNER, [RouteResourceTypes.CREATE]);
        const authorizationSecurity = SecurityReader.findFromRouteResourceOptions(options, SecurityIdentifiers.AUTHORIZATION, [RouteResourceTypes.CREATE, ALWAYS]);

        if(authorizationSecurity && !authorizationSecurity.callback(req)) {
            responseError(req, res, new UnauthorizedError(), 401)
            return;
        }

        const modelInstance = new options.resource(req.body);

        /**
         * When a resourceOwnerSecurity is defined, we need to set the record that is owned by the user
         */
        if(resourceOwnerSecurity) {

            if(!authorizationSecurity) {
                responseError(req, res, new MissingSecurityError('Expected authorized security for this route, recieved: ' + typeof authorizationSecurity), 401);
            }

            const propertyKey = resourceOwnerSecurity.arguements?.key;
            const userId = CurrentRequest.get<User>(req, 'user')?.getId()

            if(typeof propertyKey !== 'string') {
                throw new Error('Malformed resourceOwner security. Expected parameter \'key\' to be a string but received ' + typeof propertyKey);
            }

            if(!userId) {
                responseError(req, res, new UnauthorizedError(), 401)
                return;
            }

            modelInstance.setAttribute(propertyKey, userId)
        }

        await modelInstance.save();

        res.status(201).send(modelInstance.getData({ excludeGuarded: true }) as IRouteResourceOptions['resource'])
    }
    catch (err) {
        if (err instanceof Error) {
            responseError(req, res, err)
            return;
        }

        res.status(500).send({ error: 'Something went wrong' })
    }
}