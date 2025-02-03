import ForbiddenResourceError from "@src/core/domains/auth/exceptions/ForbiddenResourceError";
import UnauthorizedError from "@src/core/domains/auth/exceptions/UnauthorizedError";
import Controller from "@src/core/domains/http/base/Controller";
import ResourceCreateService from "@src/core/domains/http/resources/services/ResourceCreateService";
import ResourceDeleteService from "@src/core/domains/http/resources/services/ResourceDeleteService";
import ResourceIndexService from "@src/core/domains/http/resources/services/ResourceIndexService";
import ResourceShowService from "@src/core/domains/http/resources/services/ResourceShowService";
import ResourceUpdateService from "@src/core/domains/http/resources/services/ResourceUpdateService";

import HttpContext from "../../context/HttpContext";
import responseError from "../../handlers/responseError";
import ApiResponseBuilder from "../../response/ApiResonseBuilder";
import Paginate from "../../utils/Paginate";
import AbastractBaseResourceService from "../abstract/AbastractBaseResourceService";

type THandlerOptions = {
    showPagination: boolean;
}

const DEFAULT_HANDLER_OPTIONS: THandlerOptions = {
    showPagination: true
} as const;

/**
 * ResourceController handles CRUD operations for resources (database models)


 * 
 * This controller provides standardized endpoints for:
 * - Listing resources (index) with pagination and filtering
 * - Showing individual resources (show) 
 * - Creating new resources (create)
 * - Updating existing resources (update)
 * - Deleting resources (delete)
 *
 * It works with any model that implements the required interfaces and uses services
 * to handle the business logic for each operation. The controller:
 * 
 * - Delegates operations to specialized services (ResourceIndexService, ResourceCreateService etc)
 * - Handles authorization checks through the services
 * - Manages resource ownership validation where configured
 * - Strips protected properties before returning responses
 * - Provides consistent error handling
 *
 * Used by defining routes with Route.resource() and specifying the model, middleware and security rules
 */
class ResourceController  extends Controller {

    protected indexService = new ResourceIndexService();
    
    protected createService = new ResourceCreateService();

    protected showService = new ResourceShowService();

    protected updateService = new ResourceUpdateService();

    protected deleteService = new ResourceDeleteService();

    /**
     * @description Get all resources
     * @returns {Promise<void>}
     */
    public async index(): Promise<void> {
        await this.handler(this.context, this.indexService, { showPagination: true })
    }

    /**
     * @description Get a resource by id
     * @returns {Promise<void>}
     */
    public async show(): Promise<void> {
        await this.handler(this.context, this.showService, { showPagination: false })
    }

    /**
     * @description Create a resource
     * @returns {Promise<void>}
     */
    public async create(): Promise<void> {
        await this.handler(this.context, this.createService, { showPagination: false })

    }

    /**
     * @description Update a resource
     * @returns {Promise<void>}
     */
    public async update(): Promise<void> {
        await this.handler(this.context, this.updateService, { showPagination: false })

    }

    /**
     * @description Delete a resource
     * @returns {Promise<void>}
     */
    public async delete(): Promise<void> {
        await this.handler(this.context, this.deleteService, { showPagination: false })

    }

    /**
     * @description Handles the service
     * @param {HttpContext} context - The context
     * @param {AbastractBaseResourceService} service - The service
     * @returns {Promise<void>}
     */
    protected async handler(context: HttpContext, service: AbastractBaseResourceService, options: THandlerOptions = DEFAULT_HANDLER_OPTIONS) {
        try {
            const result = await service.handler(context)
            this.response(result, 200, options)

        }

        catch(error) {
            if(error instanceof UnauthorizedError) {
                responseError(context.getRequest(), context.getResponse(), error, 401)
                return;
            }
    
            if(error instanceof ForbiddenResourceError) {
                responseError(context.getRequest(), context.getResponse(), error, 403)
                return;
            }
    
            responseError(context.getRequest(), context.getResponse(), error as Error)

        }
    }

    /**
     * @description Handles the response
     * @param {unknown} data - The data
     * @param {number} code - The code
     * @returns {Promise<void>}
     */
    protected async response(data: unknown, code: number = 200, options: THandlerOptions = DEFAULT_HANDLER_OPTIONS) {

        const apiResponse = new ApiResponseBuilder();
        const paginate = new Paginate();
        const pagination = paginate.parseRequest(this.context.getRequest());
        
        apiResponse.addData(data);
        apiResponse.addTotalCount();

        if(options.showPagination && pagination.containsPage()) {
            apiResponse.addPagination(pagination.getPage(), pagination.getPageSize());
        }



        this.jsonResponse(apiResponse.build(), code);

    }

}

export default ResourceController;