import ForbiddenResourceError from "@src/core/domains/auth/exceptions/ForbiddenResourceError";
import UnauthorizedError from "@src/core/domains/auth/exceptions/UnauthorizedError";
import { queryBuilder } from "@src/core/domains/eloquent/services/EloquentQueryBuilderService";
import { IPageOptions } from "@src/core/domains/express/interfaces/IResourceService";
import { IRouteResourceOptionsLegacy } from "@src/core/domains/express/interfaces/IRouteResourceOptions";
import { RouteResourceTypes } from "@src/core/domains/express/routing/RouteResource";
import Paginate from "@src/core/domains/express/services/Paginate";
import QueryFilters from "@src/core/domains/express/services/QueryFilters";
import { requestContext } from "@src/core/domains/express/services/RequestContext";
import BaseResourceService from "@src/core/domains/express/services/Resources/BaseResourceService";
import { BaseRequest } from "@src/core/domains/express/types/BaseRequest.t";
import stripGuardedResourceProperties from "@src/core/domains/express/utils/stripGuardedResourceProperties";
import { Response } from "express";


class ResourceAllService extends BaseResourceService {

    routeResourceType: string = RouteResourceTypes.ALL

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
    async handler(req: BaseRequest, res: Response, options: IRouteResourceOptionsLegacy): Promise<void> {

        // Check if the authorization security applies to this route and it is valid
        if(!this.validateAuthorization(req, options)) {
            throw new UnauthorizedError()
        }
        
        // Build the page options, filters
        const pageOptions = this.buildPageOptions(req, options);
        const filters = this.buildBaseAndRequestFilters(req, options);

        // Create a query builder
        const builder = queryBuilder(options.resource)
            .where(filters, 'like')
        
        // Apply the page options
        if(pageOptions.pageSize && pageOptions.skip) {
            builder.take(pageOptions.pageSize ?? null)
                .skip(pageOptions.skip)
        }

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

        // Fetch the results
        const results  = (await builder.get()).toArray()
        const resultsGuardedStripped = await stripGuardedResourceProperties(results)

        // Send the results
        res.send(resultsGuardedStripped)
    }


    /**
     * Builds the filters object
     * 
     * @param {IRouteResourceOptionsLegacy} options - The options object
     * @returns {object} - The filters object
     */
    buildBaseAndRequestFilters(req: BaseRequest, options: IRouteResourceOptionsLegacy): object {
        const baseFilters = options.allFilters ?? {};

        return this.filtersWithPercentSigns({
            ...baseFilters,
            ...(new QueryFilters).parseRequest(req, options?.searching).getFilters()
        })
    }

    /**
     * Builds the page options
     * 
     * @param {BaseRequest} req - The request object
     * @param {IRouteResourceOptionsLegacy} options - The options object
     * @returns {IPageOptions} - An object containing the page number, page size, and skip
     */
    buildPageOptions(req: BaseRequest, options: IRouteResourceOptionsLegacy): IPageOptions  {
        const paginate = new Paginate().parseRequest(req, options.paginate);
        const page = paginate.getPage(1);
        const pageSize =  paginate.getPageSize() ?? options?.paginate?.pageSize;
        const skip = pageSize ? (page - 1) * pageSize : undefined;

        return { skip, page, pageSize };
    }

}

export default ResourceAllService;