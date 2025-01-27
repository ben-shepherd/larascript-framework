import HttpContext from "../../data/HttpContext";
import ResourceException from "../../exceptions/ResourceException";
import { TRouteItem } from "../../interfaces/IRoute";
import ResourceOwnerRule from "../../security/rules/ResourceOwnerRule";
import SecurityReader from "../SecurityReader";
import { SecurityIdentifiersLegacy } from "../SecurityRulesLegacy";

abstract class BaseResourceService {

        /**
         * The route resource type (RouteResourceTypes)
         */
        abstract routeResourceType: string;

        // eslint-disable-next-line no-unused-vars
        abstract handler(context: HttpContext): Promise<void>;

        /**
         * Checks if the request is authorized to perform the action
         * 
         * @param {BaseRequest} req - The request object
         * @param {IRouteResourceOptionsLegacy} options - The options object
         * @returns {boolean} - Whether the request is authorized
         */
        validateAuthorization(context: HttpContext): boolean {
            return context.getUser() !== undefined; 
        }

        /**
         * Checks if the request is authorized to perform the action and if the resource owner security is set
         * 
         * @param {BaseRequest} req - The request object
         * @param {IRouteResourceOptionsLegacy} options - The options object
         * @returns {boolean} - Whether the request is authorized and resource owner security is set
         */
        validateResourceOwner(context: HttpContext): boolean {
            const routeOptions = context.getRouteItem()

            if(!routeOptions) {
                throw new ResourceException('Route options are required')
            }

            const resourceOwnerSecurity = this.getResourceOwnerSecurity(routeOptions);
    
            if(this.validateAuthorization(context) && resourceOwnerSecurity ) {
                return true;
            }
    
            return false;
        }

        /**
         * Finds the resource owner security from the given options
         * @param {TRouteItem} routeOptions - The options object
         * @returns {IIdentifiableSecurityCallback | undefined} - The found resource owner security or undefined if not found
         */
        getResourceOwnerSecurity(routeOptions: TRouteItem): ResourceOwnerRule | undefined {
            const id = SecurityIdentifiersLegacy.RESOURCE_OWNER;
            const when = [this.routeResourceType];
            return SecurityReader.find<ResourceOwnerRule>(routeOptions, id, when);
        }


}

export default BaseResourceService;