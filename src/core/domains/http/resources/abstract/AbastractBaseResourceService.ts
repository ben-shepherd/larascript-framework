
import ResourceException from "@src/core/domains/express/exceptions/ResourceException";
import HttpContext from "@src/core/domains/http/context/HttpContext";
import { requestContext } from "@src/core/domains/http/context/RequestContext";
import { SecurityEnum } from "@src/core/domains/http/enums/SecurityEnum";
import { IApiResponse } from "@src/core/domains/http/interfaces/IApiResponse";
import { TRouteItem } from "@src/core/domains/http/interfaces/IRouter";
import ApiResponse from "@src/core/domains/http/response/ApiResponse";
import ResourceOwnerRule from "@src/core/domains/http/security/rules/ResourceOwnerRule";
import SecurityReader from "@src/core/domains/http/security/services/SecurityReader";
import Paginate from "@src/core/domains/http/utils/Paginate";
import { ValidatorConstructor } from "@src/core/domains/validator/interfaces/IValidator";
import { IModel, ModelConstructor } from "@src/core/interfaces/IModel";

type TResponseOptions = {
    showPagination: boolean;
}

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
        abstract handler(context: HttpContext): Promise<IApiResponse>;


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

        /**
         * Gets the validator by type
         * @param {HttpContext} context - The HTTP context
         * @returns {ValidatorConstructor | undefined} - The validator or undefined if not found
         */
        getValidator(context: HttpContext): ValidatorConstructor | undefined {
            const routeOptions = context.getRouteItem()


            if(!routeOptions) {
                throw new ResourceException('Route options are required')
            }

            const validator = routeOptions.resource?.validation?.[this.routeResourceType] as ValidatorConstructor | undefined

            if(!validator) {
                return undefined;
            }

            return validator;
        }

        /**
         * Validates the request body using the configured validator for this resource type
         * @param {HttpContext} context - The HTTP context containing the request to validate
         * @returns {Promise<void>} A promise that resolves when validation is complete
         * @throws {ValidationError} If validation fails
         */
        async getValidationErrors(context: HttpContext): Promise<string[] | undefined> {
            const validatorConstructor = this.getValidator(context)
            

            if(!validatorConstructor) {
                return undefined;
            }

            const validator = new validatorConstructor()
            const body = context.getRequest().body
            const result = await validator.validate(body)


            if(!result.success) {
                return result.joi.error?.details?.map(detail => detail.message)
            }

            return undefined;
        }

        /**
         * Builds and returns the final response object with all added data and metadata
         * @param {HttpContext} context - The HTTP context
         * @param {unknown} data - The data to be included in the response
         * @param {number} code - The HTTP status code  
         */
        apiResponse<Data = unknown>(context: HttpContext, data: Data, code: number = 200, options?: TResponseOptions): ApiResponse<Data> {
            const apiResponse = new ApiResponse<Data>()
            const paginate = new Paginate()
            const pagination = paginate.parseRequest(context.getRequest())

            apiResponse.setCode(code)
            apiResponse.setData(data)
            apiResponse.addTotalCount()

            if(options?.showPagination) {
                const defaultPageSize = context.getRouteItem()?.resource?.paginate?.pageSize ?? undefined
                
                apiResponse.addPagination(pagination.getPage(), defaultPageSize)
            }

            return apiResponse
        }

}



export default AbastractBaseResourceService;