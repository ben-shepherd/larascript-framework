import ForbiddenResourceError from "@src/core/domains/auth/exceptions/ForbiddenResourceError";
import UnauthorizedError from "@src/core/domains/auth/exceptions/UnauthorizedError";
import { queryBuilder } from "@src/core/domains/eloquent/services/EloquentQueryBuilderService";
import HttpContext from "@src/core/domains/express/data/HttpContext";
import ResourceException from "@src/core/domains/express/exceptions/ResourceException";
import { RouteResourceTypes } from "@src/core/domains/express/routing/RouterResource";
import BaseResourceService from "@src/core/domains/express/services/Resources/BaseResourceService";


class ResourceDeleteService extends BaseResourceService {

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
    async handler(context: HttpContext): Promise<{ success: boolean }> {

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
        return { success: true }
    }
        
}

export default ResourceDeleteService;