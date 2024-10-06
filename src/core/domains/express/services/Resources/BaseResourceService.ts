import { Response } from "express";

import { IPartialRouteResourceOptions, IResourceService } from "../../interfaces/IResourceService";
import { IRouteResourceOptions } from "../../interfaces/IRouteResourceOptions";
import { IIdentifiableSecurityCallback } from "../../interfaces/ISecurity";
import { RouteResourceTypes } from "../../routing/RouteResource";
import { BaseRequest } from "../../types/BaseRequest.t";
import { ALWAYS } from "../Security";
import SecurityReader from "../SecurityReader";
import { SecurityIdentifiers } from "../SecurityRules";

abstract class BaseResourceService implements IResourceService {

    /**
     * The route resource type (RouteResourceTypes)
     */
    abstract routeResourceType: string;

    // eslint-disable-next-line no-unused-vars
    abstract handler(req: BaseRequest, res: Response, options: IRouteResourceOptions): Promise<void>;

    /**
     * Checks if the request is authorized to perform the action and if the resource owner security is set
     * 
     * @param {BaseRequest} req - The request object
     * @param {IRouteResourceOptions} options - The options object
     * @returns {boolean} - Whether the request is authorized and resource owner security is set
     */
    validateResourceOwner(req: BaseRequest, options: IRouteResourceOptions, when: string[] = [this.routeResourceType]): boolean {
        const resourceOwnerSecurity = SecurityReader.findFromRouteResourceOptions(options, SecurityIdentifiers.RESOURCE_OWNER, when)
    
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
     * Finds the resource owner security from the given options
     * @param {IRouteResourceOptions} options - The options object
     * @returns {IIdentifiableSecurityCallback | undefined} - The found resource owner security or undefined if not found
     */
    getResourceOwnerSecurity(options: IPartialRouteResourceOptions): IIdentifiableSecurityCallback | undefined {
        return SecurityReader.findFromRouteResourceOptions(options as IRouteResourceOptions, SecurityIdentifiers.RESOURCE_OWNER, [this.routeResourceType]);
    }

}

export default BaseResourceService