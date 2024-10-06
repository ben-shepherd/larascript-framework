import UnauthorizedError from "@src/core/domains/auth/exceptions/UnauthorizedError";
import { IModel } from "@src/core/interfaces/IModel";
import { App } from "@src/core/services/App";
import { Response } from "express";

import { IPageOptions, IResourceService } from "../../interfaces/IResourceService";
import { IRouteResourceOptions } from "../../interfaces/IRouteResourceOptions";
import responseError from "../../requests/responseError";
import { RouteResourceTypes } from "../../routing/RouteResource";
import { BaseRequest } from "../../types/BaseRequest.t";
import stripGuardedResourceProperties from "../../utils/stripGuardedResourceProperties";
import Paginate from "../Paginate";
import { ALWAYS } from "../Security";
import SecurityReader from "../SecurityReader";
import { SecurityIdentifiers } from "../SecurityRules";


class ResourceAllService implements IResourceService {

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
            responseError(req, res, new UnauthorizedError(), 401)
            return;
        }
        
        // Build the page options, filters
        const pageOptions = this.buildPageOptions(req, options);
        let filters = this.buildFilters(options);

        // Check if the resource owner security applies to this route and it is valid
        // If it is valid, we add the owner's id to the filters
        if(this.validateResourceOwner(req, options)) {
            const resourceOwnerSecurity = SecurityReader.findFromRouteResourceOptions(options, SecurityIdentifiers.RESOURCE_OWNER, [RouteResourceTypes.ALL])
            const propertyKey = resourceOwnerSecurity?.arguements?.key as string;

            filters = {
                ...filters,
                [propertyKey]: App.container('requestContext').getByRequest<string>(req, 'userId')
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
        })
    }

    /**
     * Checks if the request is authorized to perform the action and if the resource owner security is set
     * 
     * @param {BaseRequest} req - The request object
     * @param {IRouteResourceOptions} options - The options object
     * @returns {boolean} - Whether the request is authorized and resource owner security is set
     */
    validateResourceOwner(req: BaseRequest, options: IRouteResourceOptions): boolean {
        const resourceOwnerSecurity = SecurityReader.findFromRouteResourceOptions(options, SecurityIdentifiers.RESOURCE_OWNER, [RouteResourceTypes.ALL])

        if(this.validateAuthorization(req, options) && resourceOwnerSecurity ) {
            return true;
        }

        return false;
    }
    
    /**
     * Checks if the request is authorized to perform the action
     * 
     * @param {BaseRequest} req - The request object
     * @param {IRouteResourceOptions} options - The options object
     * @returns {boolean} - Whether the request is authorized
     */
    validateAuthorization(req: BaseRequest, options: IRouteResourceOptions): boolean {
        const authorizationSecurity = SecurityReader.findFromRouteResourceOptions(options, SecurityIdentifiers.AUTHORIZED, [RouteResourceTypes.ALL, ALWAYS]);

        if(authorizationSecurity && !authorizationSecurity.callback(req)) {
            return false;
        }
        
        return true;
    }

    /**
     * Builds the filters object
     * 
     * @param {IRouteResourceOptions} options - The options object
     * @returns {object} - The filters object
     */
    buildFilters(options: IRouteResourceOptions): object {
        return options.allFilters ?? {};
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