
import HttpContext from "@src/core/domains/express/data/HttpContext";
import ResourceException from "@src/core/domains/express/exceptions/ResourceException";
import { TRouteItem } from "@src/core/domains/express/interfaces/IRoute";
import ResourceOwnerRule from "@src/core/domains/express/security/rules/ResourceOwnerRule";
import { requestContext } from "@src/core/domains/express/services/RequestContext";
import SecurityReader from "@src/core/domains/express/services/SecurityReader";
import { SecurityIdentifiersLegacy } from "@src/core/domains/express/services/SecurityRulesLegacy";

abstract class BaseResourceService {

        /**
         * The route resource type (RouteResourceTypes)
         */
        abstract routeResourceType: string;

        // eslint-disable-next-line no-unused-vars
        abstract handler(context: HttpContext): Promise<unknown>;

        /**
         * Checks if the request is authorized to perform the action
         * 
         * @param {BaseRequest} req - The request object
         * @param {IRouteResourceOptionsLegacy} options - The options object
         * @returns {boolean} - Whether the request is authorized
         */
        validateAuthorization(context: HttpContext): boolean {
            return requestContext().getByRequest<string>(context.getRequest(), 'userId') !== undefined;
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

        /**
         * Gets the resource owner property key from the route options
         * @param {TRouteItem} routeOptions - The route options
         * @param {string} defaultKey - The default key to use if the resource owner security is not found
         * @returns {string} - The resource owner property key
         */
        getResourceOwnerModelAttribute(routeOptions: TRouteItem, defaultKey: string = 'userId'): string {
            const resourceOwnerSecurity = this.getResourceOwnerSecurity(routeOptions)
            return resourceOwnerSecurity?.getRuleOptions()?.attribute as string ?? defaultKey;
        }

}

export default BaseResourceService;