
import ResourceException from "@src/core/domains/express/exceptions/ResourceException";
import HttpContext from "@src/core/domains/http/context/HttpContext";
import { requestContext } from "@src/core/domains/http/context/RequestContext";
import { TRouteItem } from "@src/core/domains/http/interfaces/IRouter";
import ResourceOwnerRule from "@src/core/domains/http/security/rules/ResourceOwnerRule";
import SecurityReader from "@src/core/domains/http/security/services/SecurityReader";
import { IModel, ModelConstructor } from "@src/core/interfaces/IModel";

import { SecurityEnum } from "../../enums/SecurityEnum";

/**
 * BaseResourceService is an abstract base class for handling CRUD operations on resources.
 * It provides common functionality for:
 * 
 * - Authorization validation
 * - Resource owner security validation 
 * - Resource attribute access control
 *
 * This class is extended by specific resource services like:
 * - ResourceIndexService (listing resources)
 * - ResourceShowService (showing single resource)
 * - ResourceCreateService (creating resources)
 * - ResourceUpdateService (updating resources) 
 * - ResourceDeleteService (deleting resources)
 *
 * Each child class implements its own handler() method with specific CRUD logic
 * while inheriting the security and validation methods from this base class.
 */

abstract class AbastractBaseResourceService {

        /**
         * The route resource type (RouteResourceTypes)
         */
        abstract routeResourceType: string;

        // eslint-disable-next-line no-unused-vars
        abstract handler(context: HttpContext): Promise<unknown>;

        /**
         * Gets the model constructor from the route options
         * @param {HttpContext} context - The HTTP context
         * @returns {ModelConstructor} - The model constructor
         * @throws {ResourceException} - If the route options are not found
         */
        getModelConstructor(context: HttpContext): ModelConstructor {
            const routeOptions = context.getRouteItem()

            if(!routeOptions) {
                throw new ResourceException('Route options are required')
            }

            const modelConstructor = routeOptions?.resource?.modelConstructor

            if(!modelConstructor) {
                throw new ResourceException('Model constructor is not set')
            }

            return modelConstructor
        }

        /**
         * Checks if the request is authorized to perform the action
         * 
         * @param {BaseRequest} req - The request object
         * @param {IRouteResourceOptionsLegacy} options - The options object

         * @returns {boolean} - Whether the request is authorized
         */
        validateAuthorized(context: HttpContext): boolean {
            return requestContext().getByRequest<string>(context.getRequest(), 'userId') !== undefined;
        }

        /**
         * Checks if the request is authorized to perform the action and if the resource owner security is set
         * 
         * @param {BaseRequest} req - The request object
         * @param {IRouteResourceOptionsLegacy} options - The options object
         * @returns {boolean} - Whether the request is authorized and resource owner security is set
         */
        validateResourceOwnerApplicable(context: HttpContext): boolean {
            const routeOptions = context.getRouteItem()

            if(!routeOptions) {
                throw new ResourceException('Route options are required')
            }

            const resourceOwnerSecurity = this.getResourceOwnerRule(routeOptions);
    
            if(this.validateAuthorized(context) && resourceOwnerSecurity ) {
                return true;
            }
    
            return false;
        }

        /**
         * Checks if the request is authorized to perform the action and if the resource owner security is set
         * 
         * @param {BaseRequest} req - The request object
         * @param {IRouteResourceOptionsLegacy} options - The options object
         * @returns {boolean} - Whether the request is authorized and resource owner security is set
         */
        validateResourceAccess(context: HttpContext, resource: IModel): boolean {
            const routeOptions = context.getRouteItem()

            if(!routeOptions) {
                throw new ResourceException('Route options are required')
            }

            const resourceOwnerSecurity = this.getResourceOwnerRule(routeOptions);

            // If the resource owner security is not set, we allow access
            if(!resourceOwnerSecurity) {
                return true;
            }

            // Get the attribute from the resource owner security
            const attribute = resourceOwnerSecurity.getRuleOptions()?.attribute as string

            if(!attribute) {
                throw new ResourceException('An attribute is required to check resource owner security')
            }

            if(!resource.getFields().includes(attribute)) {
                throw new ResourceException('The attribute ' + attribute + ' is not a valid attribute for the resource ' + resource.constructor.name)
            }

            // Get the resource owner id
            const resourceOwnerId = resource.getAttributeSync(attribute)

            if(!resourceOwnerId) {
                return false;
            }

            // Get the request user id
            const requestUserId = requestContext().getByRequest<string>(context.getRequest(), 'userId');

            if(!requestUserId) {
                return false;
            }

            return resourceOwnerId === requestUserId;
        }

        /**
         * Finds the resource owner security from the given options
         * @param {TRouteItem} routeOptions - The options object
         * @returns {IIdentifiableSecurityCallback | undefined} - The found resource owner security or undefined if not found
         */
        getResourceOwnerRule(routeOptions: TRouteItem): ResourceOwnerRule | undefined {
            const id = SecurityEnum.RESOURCE_OWNER;
            const when = [this.routeResourceType];
            return SecurityReader.find<ResourceOwnerRule>(routeOptions, id, when);
        }

        /**
         * Gets the resource owner property key from the route options
         * @param {TRouteItem} routeOptions - The route options
         * @param {string} defaultKey - The default key to use if the resource owner security is not found
         * @returns {string} - The resource owner property key
         */
        getResourceAttribute(routeOptions: TRouteItem, defaultKey: string = 'userId'): string {
            const resourceOwnerSecurity = this.getResourceOwnerRule(routeOptions)
            const attribute = resourceOwnerSecurity?.getRuleOptions()?.attribute as string ?? defaultKey;

            if(typeof attribute !== 'string') {
                throw new ResourceException('Malformed resourceOwner security. Expected parameter \'attribute\' to be a string but received ' + typeof attribute);
            }

            return attribute;
        }

}

export default AbastractBaseResourceService;