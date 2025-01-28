import ForbiddenResourceError from "@src/core/domains/auth/exceptions/ForbiddenResourceError";
import UnauthorizedError from "@src/core/domains/auth/exceptions/UnauthorizedError";
import { queryBuilder } from "@src/core/domains/eloquent/services/EloquentQueryBuilderService";
import { IPageOptions } from "@src/core/domains/express/interfaces/IResourceService";
import { RouteResourceTypes } from "@src/core/domains/express/routing/RouteResource";
import Paginate from "@src/core/domains/express/services/Paginate";
import QueryFilters from "@src/core/domains/express/services/QueryFilters";
import { requestContext } from "@src/core/domains/express/services/RequestContext";
import { BaseRequest } from "@src/core/domains/express/types/BaseRequest.t";
import stripGuardedResourceProperties from "@src/core/domains/express/utils/stripGuardedResourceProperties";
import { IModelAttributes, ModelConstructor } from "@src/core/interfaces/IModel";
import HttpContext from "@src/core/domains/express/data/HttpContext";
import ResourceException from "@src/core/domains/express/exceptions/ResourceException";
import { TRouteItem } from "@src/core/domains/express/interfaces/IRoute";
import BaseResourceService from "@src/core/domains/express/services/Resources/BaseResourceService";

class ResourceIndexService extends BaseResourceService {

    routeResourceType: string = RouteResourceTypes.INDEX

    /**
     * Handles the resource all action
     * - Validates that the request is authorized
     * - If the resource owner security is enabled, adds the owner's id to the filters
     * - Fetches the results using the filters and page options
     * - Maps the results to models
     * - Strips the guarded properties from the results
     * - Sends the results back to the client
     * @param req The request object
     * @param res The response object
     * @param options The resource options
     */
    async handler(context: HttpContext): Promise<IModelAttributes[]> {

        // Get the request, response and options
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
        const pageOptions = this.buildPageOptions(req, routeOptions);
        const filters = this.buildBaseAndRequestFilters(req, routeOptions);

        // Create a query builder
        const builder = queryBuilder(routeOptions.resourceConstructor as ModelConstructor);
                
        // Apply the filters
        if(Object.keys(filters).length > 0) {
            builder.where(filters, 'like')
        }
        
        // Apply the page options
        if(pageOptions.pageSize && pageOptions.skip) {
            builder.take(pageOptions.pageSize ?? null)
                .skip(pageOptions.skip)
        }

        // Check if the resource owner security applies to this route and it is valid
        // If it is valid, we add the owner's id to the filters
        if(this.validateResourceOwner(context)) {
            const propertyKey = this.getResourceOwnerModelAttribute(routeOptions, 'userId');
            const userId = requestContext().getByRequest<string>(req, 'userId');

            if(!userId) { 
                throw new ForbiddenResourceError()
            }

            if(typeof propertyKey !== 'string') {
                throw new Error('Malformed resourceOwner security. Expected parameter \'key\' to be a string but received ' + typeof propertyKey);
            }

            builder.where(propertyKey, '=', userId)
        }

        // Fetch the results
        const results  = (await builder.get()).toArray()
        const resultsGuardedStripped = await stripGuardedResourceProperties(results)

        // Send the results
        return resultsGuardedStripped
    }


    /**
     * Builds the filters object
     * 
     * @param {BaseRequest} req - The request object
     * @param {TRouteItem} options - The options object
     * @returns {object} - The filters object
     */
    buildBaseAndRequestFilters(req: BaseRequest, options: TRouteItem): object {
        const baseFilters = options.allFilters ?? {};

        return this.filtersWithPercentSigns({
            ...baseFilters,
            ...(new QueryFilters).parseRequest(req, options?.searching).getFilters()
        })
    }

    /**
     * Returns a new object with the same key-value pairs as the given object, but
     * with an additional key-value pair for each key, where the key is wrapped in
     * percent signs (e.g. "foo" becomes "%foo%"). This is useful for building
     * filters in MongoDB queries.
     * @param {object} filters - The object to transform
     * @returns {object} - The transformed object
     */
    filtersWithPercentSigns(filters: object): object {
        return {
            ...filters,
            ...Object.keys(filters).reduce((acc, curr) => {
                const value = filters[curr];
                acc[curr] = `%${value}%`;
                return acc;
            }, {})
        }
    }

    /**
     * Builds the page options
     * 
     * @param {BaseRequest} req - The request object
     * @param {IRouteResourceOptionsLegacy} options - The options object
     * @returns {IPageOptions} - An object containing the page number, page size, and skip
     */
    buildPageOptions(req: BaseRequest, options: TRouteItem): IPageOptions  {
        const paginate = new Paginate().parseRequest(req, options.paginate);
        const page = paginate.getPage(1);
        const pageSize =  paginate.getPageSize() ?? options?.paginate?.pageSize;
        const skip = pageSize ? (page - 1) * pageSize : undefined;

        return { skip, page, pageSize };
    }

}

export default ResourceIndexService;