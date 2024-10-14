import ForbiddenResourceError from "@src/core/domains/auth/exceptions/ForbiddenResourceError";
import UnauthorizedError from "@src/core/domains/auth/exceptions/UnauthorizedError";
import { IPageOptions } from "@src/core/domains/express/interfaces/IResourceService";
import { IRouteResourceOptions } from "@src/core/domains/express/interfaces/IRouteResourceOptions";
import { RouteResourceTypes } from "@src/core/domains/express/routing/RouteResource";
import Paginate from "@src/core/domains/express/services/Paginate";
import QueryFilters from "@src/core/domains/express/services/QueryFilters";
import BaseResourceService from "@src/core/domains/express/services/Resources/BaseResourceService";
import { BaseRequest } from "@src/core/domains/express/types/BaseRequest.t";
import stripGuardedResourceProperties from "@src/core/domains/express/utils/stripGuardedResourceProperties";
import { IModel } from "@src/core/interfaces/IModel";
import { App } from "@src/core/services/App";
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
    async handler(req: BaseRequest, res: Response, options: IRouteResourceOptions): Promise<void> {

        // Check if the authorization security applies to this route and it is valid
        if(!this.validateAuthorization(req, options)) {
            throw new UnauthorizedError()
        }
        
        // Build the page options, filters
        const pageOptions = this.buildPageOptions(req, options);
        let filters = this.buildFilters(req, options);

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

            filters = {
                ...filters,
                [propertyKey]: userId
            }
        }

        // Fetch the results
        const results = await this.fetchResults(options, filters, pageOptions)
        const resultsAsModels = results.map((result) => new options.resource(result));

        // Send the results
        res.send(stripGuardedResourceProperties(resultsAsModels))
    }

    /**
     * Fetches the results from the database
     * 
     * @param {object} filters - The filters to use when fetching the results
     * @param {IPageOptions} pageOptions - The page options to use when fetching the results
     * @returns {Promise<IModel[]>} - A promise that resolves to the fetched results as an array of models
     */
    async fetchResults(options: IRouteResourceOptions, filters: object, pageOptions: IPageOptions): Promise<IModel[]> {
        const tableName = (new options.resource).table;
        const documentManager = App.container('db').documentManager().table(tableName);

        return await documentManager.findMany({
            filter: filters,
            limit: pageOptions.pageSize,
            skip: pageOptions.skip,
            useFuzzySearch: options.searching?.useFuzzySearch,
        })
    }

    /**
     * Builds the filters object
     * 
     * @param {IRouteResourceOptions} options - The options object
     * @returns {object} - The filters object
     */
    buildFilters(req: BaseRequest, options: IRouteResourceOptions): object {
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
     * @param {IRouteResourceOptions} options - The options object
     * @returns {IPageOptions} - An object containing the page number, page size, and skip
     */
    buildPageOptions(req: BaseRequest, options: IRouteResourceOptions): IPageOptions  {
        const paginate = new Paginate().parseRequest(req, options.paginate);
        const page = paginate.getPage(1);
        const pageSize =  paginate.getPageSize() ?? options?.paginate?.pageSize;
        const skip = pageSize ? (page - 1) * pageSize : undefined;

        return { skip, page, pageSize };
    }

}

export default ResourceAllService;