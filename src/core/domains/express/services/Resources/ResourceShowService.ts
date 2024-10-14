import ForbiddenResourceError from "@src/core/domains/auth/exceptions/ForbiddenResourceError";
import UnauthorizedError from "@src/core/domains/auth/exceptions/UnauthorizedError";
import { IRouteResourceOptions } from "@src/core/domains/express/interfaces/IRouteResourceOptions";
import { RouteResourceTypes } from "@src/core/domains/express/routing/RouteResource";
import BaseResourceService from "@src/core/domains/express/services/Resources/BaseResourceService";
import { BaseRequest } from "@src/core/domains/express/types/BaseRequest.t";
import stripGuardedResourceProperties from "@src/core/domains/express/utils/stripGuardedResourceProperties";
import ModelNotFound from "@src/core/exceptions/ModelNotFound";
import { IModel } from "@src/core/interfaces/IModel";
import { App } from "@src/core/services/App";
import { Response } from "express";



class ResourceShowService extends BaseResourceService {

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
    async handler(req: BaseRequest, res: Response, options: IRouteResourceOptions): Promise<void> {

        // Check if the authorization security applies to this route and it is valid
        if(!this.validateAuthorization(req, options)) {
            throw new UnauthorizedError()
        }

        // Build the filters
        let filters: object = {}

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
      
}

export default ResourceShowService;