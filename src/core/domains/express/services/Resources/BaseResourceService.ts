import { IPartialRouteResourceOptions, IResourceService } from "@src/core/domains/express/interfaces/IResourceService";
import { IIdentifiableSecurityCallback } from "@src/core/domains/express/interfaces/ISecurity";
import SecurityReader from "@src/core/domains/express/services/SecurityReader";
import { SecurityIdentifiers } from "@src/core/domains/express/services/SecurityRules";
import { BaseRequest } from "@src/core/domains/express/types/BaseRequest.t";
import { IModel } from "@src/core/interfaces/IModel";
import { Response } from "express";

import { IRouteResourceOptionsLegacy } from "../../interfaces/IRouteResourceOptionsLegacy";
import { RouteResourceTypes } from "../../routing/RouteResource";
import { ALWAYS } from "../SecurityLegacy";

abstract class BaseResourceService implements IResourceService {

    /**
     * The route resource type (RouteResourceTypes)
     */
    abstract routeResourceType: string;

    // eslint-disable-next-line no-unused-vars
    abstract handler(req: BaseRequest, res: Response, options: IRouteResourceOptionsLegacy): Promise<void>;

    /**
     * Checks if the request is authorized to perform the action and if the resource owner security is set
     * 
     * @param {BaseRequest} req - The request object
     * @param {IRouteResourceOptionsLegacy} options - The options object
     * @returns {boolean} - Whether the request is authorized and resource owner security is set
     */
    validateResourceOwner(req: BaseRequest, options: IRouteResourceOptionsLegacy): boolean {
        const resourceOwnerSecurity = this.getResourceOwnerSecurity(options);
    
        if(this.validateAuthorization(req, options) && resourceOwnerSecurity ) {
            return true;
        }
    
        return false;
    }

    /**
     * Checks if the request is authorized to perform the action and if the resource owner security is set on the given resource instance
     * 
     * @param {BaseRequest} req - The request object
     * @param {IRouteResourceOptionsLegacy} options - The options object
     * @param {IModel} resourceInstance - The resource instance
     * @returns {boolean} - Whether the request is authorized and resource owner security is set on the given resource instance
     */
    validateResourceOwnerCallback(req: BaseRequest, options: IRouteResourceOptionsLegacy, resourceInstance: IModel): boolean {
        const resourceOwnerSecurity = this.getResourceOwnerSecurity(options);
        
        if(this.validateAuthorization(req, options) && resourceOwnerSecurity?.callback(req, resourceInstance)) {
            return true;
        }
        
        return false;
    }
        
    /**
     * Checks if the request is authorized to perform the action
     * 
     * @param {BaseRequest} req - The request object
     * @param {IRouteResourceOptionsLegacy} options - The options object
     * @returns {boolean} - Whether the request is authorized
     */
    validateAuthorization(req: BaseRequest, options: IRouteResourceOptionsLegacy): boolean {
        const authorizationSecurity = SecurityReader.findFromRouteResourceOptions(options, SecurityIdentifiers.AUTHORIZED, [RouteResourceTypes.INDEX, ALWAYS]);

        if(authorizationSecurity && !authorizationSecurity.callback(req)) {
            return false;
        }
        
        return true;
    }

    /**
     * Finds the resource owner security from the given options
     * @param {IRouteResourceOptionsLegacy} options - The options object
     * @returns {IIdentifiableSecurityCallback | undefined} - The found resource owner security or undefined if not found
     */
    getResourceOwnerSecurity(options: IPartialRouteResourceOptions): IIdentifiableSecurityCallback | undefined {
        return SecurityReader.findFromRouteResourceOptions(options as IRouteResourceOptionsLegacy, SecurityIdentifiers.RESOURCE_OWNER, [this.routeResourceType]);
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

}

export default BaseResourceService