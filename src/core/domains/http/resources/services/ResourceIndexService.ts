import { queryBuilder } from "@src/core/domains/eloquent/services/EloquentQueryBuilderService";
import ResourceException from "@src/core/domains/express/exceptions/ResourceException";
import HttpContext from "@src/core/domains/http/context/HttpContext";
import { IPageOptions } from "@src/core/domains/http/interfaces/IResourceService";
import { TRouteItem } from "@src/core/domains/http/interfaces/IRouter";
import AbastractBaseResourceService from "@src/core/domains/http/resources/abstract/AbastractBaseResourceService";
import ApiResponse from "@src/core/domains/http/response/ApiResponse";
import { RouteResourceTypes } from "@src/core/domains/http/router/RouterResource";
import Paginate from "@src/core/domains/http/utils/Paginate";
import QueryFilters from "@src/core/domains/http/utils/QueryFilters";
import SortOptions from "@src/core/domains/http/utils/SortOptions";
import stripGuardedResourceProperties from "@src/core/domains/http/utils/stripGuardedResourceProperties";
import { IModelAttributes } from "@src/core/interfaces/IModel";

/**
 * Service class that handles retrieving collections of resources through HTTP requests
 * 
 * This service:
 * - Validates authorization for viewing the resource collection
 * - Applies pagination and filtering options from the request
 * - Fetches filtered and paginated results
 * - Strips protected properties before returning
 * 
 * Used by ResourceController to handle GET requests for resource collections.
 * Provides standardized index/list functionality while enforcing security rules
 * and data protection.
 *
 * Key features:
 * - Pagination support via pageSize and skip parameters
 * - Filtering via query parameters
 * - Authorization checks
 * - Protected property stripping
 */

class ResourceIndexService extends AbastractBaseResourceService {

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
    async handler(context: HttpContext): Promise<ApiResponse<IModelAttributes[]>> {


        // Get the route options
        const routeOptions = context.getRouteItem()

        if(!routeOptions) {
            throw new ResourceException('Route options are required')
        }
        
        // Build the page options, filters
        const pageOptions = this.buildPageOptions(context);
        const filters = this.getQueryFilters(context);


        // Create a query builder
        const builder = queryBuilder(this.getModelConstructor(context));
                

        // Apply the filters
        if(Object.keys(filters).length > 0) {
            builder.where(filters, 'like')
        }
        
        // Apply the page options
        if(typeof pageOptions.pageSize === 'number' && typeof pageOptions.skip === 'number') {
            builder.take(pageOptions.pageSize ?? null)
                .skip(pageOptions.skip)
        }

        // Apply the sort options
        const sortOptions = this.buildSortOptions(context);

        if(sortOptions) {
            builder.orderBy(sortOptions.field, sortOptions.sortDirection)
        }


        // Check if the resource owner security applies to this route and it is valid
        // If it is valid, we add the owner's id to the filters
        if(await this.validateResourceOwnerApplicable(context)) {
            const attribute = this.getResourceAttribute(routeOptions);
            const userId = context.getRequest().user?.getId() as string
            builder.where(attribute, '=', userId)
        }

        // Fetch the results
        const results  = (await builder.get()).toArray()
        const attributes = await stripGuardedResourceProperties(results)

        // Send the results
        return this.apiResponse<IModelAttributes[]>(context, attributes, 200, {
            showPagination: true
        })
    }




    /**
     * Builds the filters object by combining base filters defined in route options with
     * request filters from the query string. 
     * 
     * The base filters are defined in the route's
     * resource.filters.index configuration, while request filters come from the 'filters'
     * query parameter. 
     * 
     * The combined filters are processed to add SQL LIKE wildcards and
     * stripped of any fields that don't exist on the resource model.
     * 
     * @param {BaseRequest} req - The request object
     * @param {TRouteItem} options - The options object
     * @returns {object} - The filters object
     */
    getQueryFilters(context: HttpContext): object {
        const req = context.getRequest()
        const options = context.getRouteItem() as TRouteItem

        const baseFilters = options?.resource?.filters ?? {};
        const allowedFields = options?.resource?.searching?.fields ?? []

        // Build the filters with percent signs
        // Example: { title: 'foo' } becomes { title: '%foo%' }
        const filters = this.filtersWithPercentSigns({
            ...baseFilters,
            ...(new QueryFilters).parseRequest(req, { allowedFields: allowedFields }).getFilters()
        })

        // Strip the non-resource fields from the filters
        // Example: { title: 'foo', badProperty: '123' } becomes { title: 'foo' }
        const filtersStrippedNonResourceFields = this.stripNonResourceFields(context, filters)
        
        return filtersStrippedNonResourceFields
    }

    /**
     * Strips the non-resource fields from the filters
     * 
     * @param {object} filters - The filters object
     * @returns {object} - The stripped filters object
     */
    stripNonResourceFields(context: HttpContext, filters: object): object {
        const resourceFields = this.getModelConstructor(context).getFields()

        return Object.keys(filters).filter(key => resourceFields.includes(key)).reduce((acc, key) => {
            acc[key] = filters[key];
            return acc;
        }, {});
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
    buildPageOptions(context: HttpContext): IPageOptions  {
        const req = context.getRequest()
        const options = context.getRouteItem() as TRouteItem

        const paginate = new Paginate().parseRequest(req, options.resource?.paginate);
        const page = paginate.getPage(1);
        const pageSize =  paginate.getPageSize() ?? options?.resource?.paginate?.pageSize;
        const skip = pageSize ? (page - 1) * pageSize : undefined;

        return { skip, page, pageSize };
    }

    /**
     * Builds the sort options
     * 
     * @param {BaseRequest} req - The request object
     * @returns {SortOptions} - The sort options
     */
    buildSortOptions(context: HttpContext): SortOptions | undefined {
        const req = context.getRequest()
        const routeOptions = context.getRouteItem() as TRouteItem
        const sortOptions = routeOptions.resource?.sorting;
        const result = SortOptions.parseRequest(req, sortOptions);
        
        // Check if the sorting field is a valid field on the model
        if(!this.getModelConstructor(context).getFields().includes(result.field)) {
            return undefined
        }

        return result
    }



}

export default ResourceIndexService;