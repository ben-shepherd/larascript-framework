import ForbiddenResourceError from "@src/core/domains/auth-legacy/exceptions/ForbiddenResourceError";
import UnauthorizedError from "@src/core/domains/auth-legacy/exceptions/UnauthorizedError";
import ResourceException from "@src/core/domains/express/exceptions/ResourceException";
import HttpContext from "@src/core/domains/http/context/HttpContext";
import AbastractBaseResourceService from "@src/core/domains/http/resources/abstract/AbastractBaseResourceService";
import { RouteResourceTypes } from "@src/core/domains/http/router/RouterResource";
import stripGuardedResourceProperties from "@src/core/domains/http/utils/stripGuardedResourceProperties";
import { IModelAttributes } from "@src/core/interfaces/IModel";
import { App } from "@src/core/services/App";

import { TResponseErrorMessages } from "../../interfaces/ErrorResponse.t";
import ApiResponse from "../../response/ApiResponse";

/**
 * Service class that handles creating new resources through HTTP requests

 * 
 * This service:
 * - Validates authorization for creating resources
 * - Creates a new model instance with request data
 * - Sets resource ownership if enabled
 * - Saves the new resource
 * - Strips protected properties before returning
 * 
 * Used by ResourceController to handle POST requests for creating resources.
 * Provides standardized create functionality while enforcing security rules
 * and data protection.
 *
 * Key features:
 * - Authorization validation
 * - Resource ownership assignment
 * - Protected property stripping
 * - Standardized resource creation
 */

class ResourceCreateService extends AbastractBaseResourceService {

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
    async handler(context: HttpContext): Promise<ApiResponse<IModelAttributes | TResponseErrorMessages>> {


        const req = context.getRequest()
        const routeOptions = context.getRouteItem()

        if(!routeOptions) {
            throw new ResourceException('Route options are required')
        }

        // Build the page options, filters
        const modelConstructor = this.getModelConstructor(context)
        const model = modelConstructor.create()

        // Check if the resource owner security applies to this route and it is valid
        // If it is valid, we add the owner's id to the filters
        if(this.validateResourceOwnerApplicable(context)) {

            if(!this.validateAuthorized(context)) {
                throw new UnauthorizedError()
            }

            const attribute = this.getResourceAttribute(routeOptions, 'userId');
            const userId = App.container('requestContext').getByRequest<string>(req, 'userId');
            
            if(!userId) {
                throw new ForbiddenResourceError()
            }

            model.setAttribute(attribute, userId)
        }

        // Validate the request body
        const validationErrors = await this.getValidationErrors(context)

        if(validationErrors) {
            return this.apiResponse(context, {
                errors: validationErrors
            }, 422)
        }

        // Fill the model instance with the request body
        model.fill(req.body)
        await model.save();

        // Strip the guarded properties from the model instance
        const attributes = await stripGuardedResourceProperties(model)

        // Send the results
        return this.apiResponse(context, attributes[0], 201)
    }

}

export default ResourceCreateService