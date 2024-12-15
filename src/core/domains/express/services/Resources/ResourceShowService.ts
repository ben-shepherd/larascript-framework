import ForbiddenResourceError from "@src/core/domains/auth/exceptions/ForbiddenResourceError";
import UnauthorizedError from "@src/core/domains/auth/exceptions/UnauthorizedError";
import { queryBuilder } from "@src/core/domains/eloquent/services/EloquentQueryBuilderService";
import { IRouteResourceOptions } from "@src/core/domains/express/interfaces/IRouteResourceOptions";
import { RouteResourceTypes } from "@src/core/domains/express/routing/RouteResource";
import BaseResourceService from "@src/core/domains/express/services/Resources/BaseResourceService";
import { BaseRequest } from "@src/core/domains/express/types/BaseRequest.t";
import stripGuardedResourceProperties from "@src/core/domains/express/utils/stripGuardedResourceProperties";
import { Response } from "express";

import { requestContext } from "../RequestContext";



class ResourceShowService extends BaseResourceService {

    routeResourceType: string = RouteResourceTypes.SHOW

    /**
     * Handles the resource show action
     * - Validates that the request is authorized
     * - If the resource owner security is enabled, adds the owner's id to the filters
     * - Fetches the result using the filters
     * - Maps the result to a model
     * - Strips the guarded properties from the result
     * - Sends the result back to the client
     * @param req The request object
     * @param res The response object
     * @param options The resource options
     */
    async handler(req: BaseRequest, res: Response, options: IRouteResourceOptions): Promise<void> {

        // Check if the authorization security applies to this route and it is valid
        if(!this.validateAuthorization(req, options)) {
            throw new UnauthorizedError()
        }

        // Query builder
        const builder = queryBuilder(options.resource) 
            .limit(1)

        // Check if the resource owner security applies to this route and it is valid
        // If it is valid, we add the owner's id to the filters
        if(this.validateResourceOwner(req, options)) {
            const resourceOwnerSecurity = this.getResourceOwnerSecurity(options)
            const propertyKey = resourceOwnerSecurity?.arguements?.key as string;
            const userId = requestContext().getByRequest<string>(req, 'userId');
            
            if(!userId) {
                throw new ForbiddenResourceError()
            }

            if(typeof propertyKey !== 'string') {
                throw new Error('Malformed resourceOwner security. Expected parameter \'key\' to be a string but received ' + typeof propertyKey);
            }

            builder.where(propertyKey, '=', userId)
        }

        // Attach the id to the query
        builder.where(options.resource.getPrimaryKey(), req.params?.id)

        // Fetch the results
        const resultAsModel = await builder.firstOrFail()

        // Strip the guarded properties
        const resultGuardedStrip = (await stripGuardedResourceProperties(resultAsModel))[0]

        // Send the results
        res.send(resultGuardedStrip)
    }
      
}

export default ResourceShowService;