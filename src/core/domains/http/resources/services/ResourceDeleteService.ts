import ForbiddenResourceError from "@src/core/domains/auth-legacy/exceptions/ForbiddenResourceError";
import UnauthorizedError from "@src/core/domains/auth-legacy/exceptions/UnauthorizedError";
import { queryBuilder } from "@src/core/domains/eloquent/services/EloquentQueryBuilderService";
import ResourceException from "@src/core/domains/express/exceptions/ResourceException";
import HttpContext from "@src/core/domains/http/context/HttpContext";
import AbastractBaseResourceService from "@src/core/domains/http/resources/abstract/AbastractBaseResourceService";
import { RouteResourceTypes } from "@src/core/domains/http/router/RouterResource";

import ApiResponse from "../../response/ApiResponse";

/**
 * Service class that handles deleting resources through HTTP requests
 * 
 * This service:
 * - Validates authorization for deleting the resource
 * - Fetches the resource by ID
 * - Validates resource ownership if enabled
 * - Deletes the resource
 * - Returns success response
 * 
 * Used by ResourceController to handle DELETE requests for resources.
 * Provides standardized delete functionality while enforcing security rules
 * and ownership validation.
 *
 * Key features:
 * - Authorization checks before deletion
 * - Resource ownership validation
 * - Secure deletion of resources
 * - Standardized success response
 */
class ResourceDeleteService extends AbastractBaseResourceService {

    routeResourceType: string = RouteResourceTypes.DELETE

    /**
     * Handles the resource delete action
     * - Validates that the request is authorized
     * - Checks if the resource owner security applies to this route and it is valid
     * - Deletes the resource
     * - Sends the results back to the client
     * @param {BaseRequest} req - The request object
     * @param {Response} res - The response object
     * @param {IRouteResourceOptionsLegacy} options - The options object
     * @returns {Promise<void>}
     */
    async handler(context: HttpContext): Promise<ApiResponse> {


        // Check if the authorization security applies to this route and it is valid
        if(!this.validateAuthorized(context)) {
            throw new UnauthorizedError()
        }
        
        const routeOptions = context.getRouteItem()

        if(!routeOptions) {
            throw new ResourceException('Route options are required')
        }

        const modelConstructor = this.getModelConstructor(context)

        const builder = queryBuilder(modelConstructor)
            .where(modelConstructor.getPrimaryKey(), context.getRequest().params?.id)

        const result = await builder.firstOrFail()

        
        // Check if the resource owner security applies to this route and it is valid
        if(!this.validateResourceAccess(context, result)) {
            throw new ForbiddenResourceError()
        }

        // Delete the resource item
        await result.delete()

        // Send the results
        return this.apiResponse(context, {}, 200)
    }
        
}

export default ResourceDeleteService;