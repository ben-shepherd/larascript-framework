import ForbiddenResourceError from "@src/core/domains/auth/exceptions/ForbiddenResourceError";
import UnauthorizedError from "@src/core/domains/auth/exceptions/UnauthorizedError";
import ModelNotFound from "@src/core/exceptions/ModelNotFound";
import { IModel } from "@src/core/interfaces/IModel";
import { App } from "@src/core/services/App";
import { Response } from "express";

import { IPageOptions, IResourceService } from "../../interfaces/IResourceService";
import { IRouteResourceOptions } from "../../interfaces/IRouteResourceOptions";
import { RouteResourceTypes } from "../../routing/RouteResource";
import { BaseRequest } from "../../types/BaseRequest.t";
import stripGuardedResourceProperties from "../../utils/stripGuardedResourceProperties";
import { ALWAYS } from "../Security";
import SecurityReader from "../SecurityReader";
import { SecurityIdentifiers } from "../SecurityRules";


class ResourceShowService implements IResourceService {

    
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
    async handler(req: BaseRequest, res: Response, options: IRouteResourceOptions): Promise<void> {

        // Check if the authorization security applies to this route and it is valid
        if(!this.validateAuthorization(req, options)) {
            throw new UnauthorizedError()
        }
        
        // Build the page options, filters
        let filters = this.buildFilters(options);

        // Check if the resource owner security applies to this route and it is valid
        // If it is valid, we add the owner's id to the filters
        if(this.validateResourceOwner(req, options)) {
            const resourceOwnerSecurity = SecurityReader.findFromRouteResourceOptions(options, SecurityIdentifiers.RESOURCE_OWNER, [RouteResourceTypes.ALL])
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
        const result = await this.fetchRecord(options, filters)

        if (!result) {
            throw new ModelNotFound();
        }
        
        const resultAsModel = new options.resource(result)

        // Send the results
        res.send(stripGuardedResourceProperties(resultAsModel))
    }

    /**
     * Fetches the results from the database
     * 
     * @param {object} filters - The filters to use when fetching the results
     * @param {IPageOptions} pageOptions - The page options to use when fetching the results
     * @returns {Promise<IModel[]>} - A promise that resolves to the fetched results as an array of models
     */
    async fetchRecord(options: IRouteResourceOptions, filters: object): Promise<IModel | null> {
        const tableName = (new options.resource).table;
        const documentManager = App.container('db').documentManager().table(tableName);

        return await documentManager.findOne({
            filter: filters,
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
        return options.showFilters ?? {};
    }
            
}

export default ResourceShowService;