import ForbiddenResourceError from "@src/core/domains/auth/exceptions/ForbiddenResourceError";
import UnauthorizedError from "@src/core/domains/auth/exceptions/UnauthorizedError";
import { IRouteResourceOptions } from "@src/core/domains/express/interfaces/IRouteResourceOptions";
import { RouteResourceTypes } from "@src/core/domains/express/routing/RouteResource";
import BaseResourceService from "@src/core/domains/express/services/Resources/BaseResourceService";
import { BaseRequest } from "@src/core/domains/express/types/BaseRequest.t";
import stripGuardedResourceProperties from "@src/core/domains/express/utils/stripGuardedResourceProperties";
import { App } from "@src/core/services/App";
import { Response } from "express";


class ResourceCreateService extends BaseResourceService {

    routeResourceType: string = RouteResourceTypes.CREATE

    /**
     * Handles the resource create action
     * - Validates that the request is authorized
     * - If the resource owner security is enabled, adds the owner's id to the model properties
     * - Creates a new model instance with the request body
     * - Saves the model instance
     * - Strips the guarded properties from the model instance
     * - Sends the model instance back to the client
     * @param req The request object
     * @param res The response object
     * @param options The resource options
     */
    async handler(req: BaseRequest, res: Response, options: IRouteResourceOptions): Promise<void> {

        // Check if the authorization security applies to this route and it is valid
        if(!this.validateAuthorization(req, options)) {
            throw new UnauthorizedError()
        }
        
        // Build the page options, filters
        const modalInstance = new options.resource(req.body);

        // Check if the resource owner security applies to this route and it is valid
        // If it is valid, we add the owner's id to the filters
        if(this.validateResourceOwner(req, options)) {
            const resourceOwnerSecurity = this.getResourceOwnerSecurity(options)
            const propertyKey = resourceOwnerSecurity?.arguements?.key as string;
            const userId = App.container('requestContext').getByRequest<string>(req, 'userId');
            
            if(!userId) {
                throw new ForbiddenResourceError()
            }

            if(typeof propertyKey !== 'string') {
                throw new Error('Malformed resourceOwner security. Expected parameter \'key\' to be a string but received ' + typeof propertyKey);
            }

            modalInstance.setAttribute(propertyKey, userId)
        }

        await modalInstance.save();

        // Send the results
        res.status(201).send(stripGuardedResourceProperties(modalInstance))
    }
      
}

export default ResourceCreateService;