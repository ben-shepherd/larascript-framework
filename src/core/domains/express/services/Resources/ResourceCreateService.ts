import ForbiddenResourceError from "@src/core/domains/auth/exceptions/ForbiddenResourceError";
import UnauthorizedError from "@src/core/domains/auth/exceptions/UnauthorizedError";
import { IModelAttributes, ModelConstructor } from "@src/core/interfaces/IModel";
import { App } from "@src/core/services/App";

import HttpContext from "../../data/HttpContext";
import ResourceException from "../../exceptions/ResourceException";
import { RouteResourceTypes } from "../../routing/RouteResource";
import stripGuardedResourceProperties from "../../utils/stripGuardedResourceProperties";
import BaseResourceService from "./BaseResourceService";

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
    async handler(context: HttpContext): Promise<IModelAttributes> {

        const req = context.getRequest()
        const routeOptions = context.getRouteItem()

        if(!routeOptions) {
            throw new ResourceException('Route options are required')
        }

        // Check if the authorization security applies to this route and it is valid
        if(!this.validateAuthorization(context)) {
            throw new UnauthorizedError()
        }
        
        // Build the page options, filters
        const modalInstance = new (routeOptions.resourceConstructor as ModelConstructor)(req.body);

        // Check if the resource owner security applies to this route and it is valid
        // If it is valid, we add the owner's id to the filters
        if(this.validateResourceOwner(context)) {
            const propertyKey = this.getResourceOwnerPropertyKey(routeOptions, 'userId');
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

        // Strip the guarded properties from the model instance
        const modelAttributesStripped = await stripGuardedResourceProperties(modalInstance)

        // Send the results
        return modelAttributesStripped[0]
    }

}

export default ResourceCreateService