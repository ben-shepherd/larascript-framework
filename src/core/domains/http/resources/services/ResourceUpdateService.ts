import ForbiddenResourceError from "@src/core/domains/auth/exceptions/ForbiddenResourceError";
import UnauthorizedError from "@src/core/domains/auth/exceptions/UnauthorizedError";
import { queryBuilder } from "@src/core/domains/eloquent/services/EloquentQueryBuilderService";
import ResourceException from "@src/core/domains/express/exceptions/ResourceException";
import HttpContext from "@src/core/domains/http/context/HttpContext";
import { TResponseErrorMessages } from "@src/core/domains/http/interfaces/ErrorResponse.t";
import AbastractBaseResourceService from "@src/core/domains/http/resources/abstract/AbastractBaseResourceService";
import ApiResponse from "@src/core/domains/http/response/ApiResponse";
import { RouteResourceTypes } from "@src/core/domains/http/router/RouterResource";
import stripGuardedResourceProperties from "@src/core/domains/http/utils/stripGuardedResourceProperties";
import { IModelAttributes } from "@src/core/interfaces/IModel";

/**
 * Service class that handles updating existing resources through HTTP requests
 * 
 * This service:
 * - Validates authorization for the update action
 * - Fetches the existing resource by ID
 * - Validates resource ownership if enabled
 * - Updates the resource with request data
 * - Strips protected properties before returning
 * 
 * Used by ResourceController to handle PUT/PATCH requests to update resources.
 * Provides standardized update functionality while enforcing security rules
 * and data protection.
 */
class ResourceUpdateService extends AbastractBaseResourceService {

    routeResourceType: string = RouteResourceTypes.UPDATE

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
    async handler(context: HttpContext): Promise<ApiResponse<IModelAttributes | TResponseErrorMessages>> {

        // Check if the authorization security applies to this route and it is valid
        if(!await this.validateAuthorized()) {
            throw new UnauthorizedError()
        }
        
        const routeOptions = context.getRouteItem()

        if(!routeOptions) {
            throw new ResourceException('Route options are required')
        }

        // Validate the request body
        const validationErrors = await this.getValidationErrors(context)

        if(validationErrors) {
            return this.apiResponse(context, {
                errors: validationErrors
            }, 422)
        }


        const modelConstructor = this.getModelConstructor(context)

        const builder = queryBuilder(modelConstructor)
            .where(modelConstructor.getPrimaryKey(), context.getRequest().params?.id)


        const result = await builder.firstOrFail()

        // Check if the resource owner security applies to this route and it is valid
        if(!await this.validateResourceAccess(context, result)) {
            throw new ForbiddenResourceError()
        }

        await result.fill(context.getRequest().body);
        await result.save();
        
        // Send the results
        return this.apiResponse<IModelAttributes>(context, (await stripGuardedResourceProperties(result))[0], 200)

    }
        

}

export default ResourceUpdateService;