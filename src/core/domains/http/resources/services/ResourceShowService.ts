import ForbiddenResourceError from "@src/core/domains/auth/exceptions/ForbiddenResourceError";
import UnauthorizedError from "@src/core/domains/auth/exceptions/UnauthorizedError";
import { queryBuilder } from "@src/core/domains/eloquent/services/EloquentQueryBuilderService";
import ResourceException from "@src/core/domains/express/exceptions/ResourceException";
import HttpContext from "@src/core/domains/http/context/HttpContext";
import AbastractBaseResourceService from "@src/core/domains/http/resources/abstract/AbastractBaseResourceService";
import { RouteResourceTypes } from "@src/core/domains/http/router/RouterResource";
import stripGuardedResourceProperties from "@src/core/domains/http/utils/stripGuardedResourceProperties";
import { IModelAttributes } from "@src/core/interfaces/IModel";


class ResourceShowService extends AbastractBaseResourceService {

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
    async handler(context: HttpContext): Promise<IModelAttributes> {

        // Check if the authorization security applies to this route and it is valid
        if(!this.validateAuthorized(context)) {
            throw new UnauthorizedError()
        }

        const routeOptions = context.getRouteItem()

        if(!routeOptions) {
            throw new ResourceException('Route options are required')
        }

        const modelConstructor = this.getModelConstructor(context)
        
        // Query builder
        const builder = queryBuilder(modelConstructor) 
            .limit(1)

        // Attach the id to the query
        builder.where(modelConstructor.getPrimaryKey(), context.getRequest().params?.id)

        // Fetch the results
        const result = await builder.firstOrFail()

        // Check if the resource owner security applies to this route and it is valid
        if(!this.validateResourceAccess(context, result)) {
            throw new ForbiddenResourceError()
        }

        // Send the results
        return (await stripGuardedResourceProperties(result))[0]
    }
      
}

export default ResourceShowService;