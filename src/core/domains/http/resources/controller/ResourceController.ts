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
import Paginate from "../../utils/Paginate";
import AbastractBaseResourceService from "../abstract/AbastractBaseResourceService";

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
        await this.handler(this.context, this.indexService)
    }

    /**
     * @description Get a resource by id
     * @returns {Promise<void>}
     */
    public async show(): Promise<void> {
        await this.handler(this.context, this.showService)
    }

    /**
     * @description Create a resource
     * @returns {Promise<void>}
     */
    public async create(): Promise<void> {
        await this.handler(this.context, this.createService)
    }

    /**
     * @description Update a resource
     * @returns {Promise<void>}
     */
    public async update(): Promise<void> {
        await this.handler(this.context, this.updateService)
    }

    /**
     * @description Delete a resource
     * @returns {Promise<void>}
     */
    public async delete(): Promise<void> {
        await this.handler(this.context, this.deleteService)
    }

    /**
     * @description Handles the service
     * @param {HttpContext} context - The context
     * @param {AbastractBaseResourceService} service - The service
     * @returns {Promise<void>}
     */
    protected async handler(context: HttpContext, service: AbastractBaseResourceService) {
        try {
            const result = await service.handler(context)
            this.response(result)
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
    protected async response(data: unknown, code: number = 200) {


        type TResponse = { 
            data: unknown,
            meta: {
                total?: number;
                page?: number;
                pageSize?: number;
                nextPage?: number;
                previousPage?: number;
            }
        }



        const response: TResponse = {
            meta: {},
            data
        }


        // Check if data is countable
        const isCountable = data !== null && typeof data === 'object' && 'length' in data;
        const totalCount = isCountable ? (data as unknown[]).length : null;

        if(totalCount) {
            response.meta.total = totalCount;
        }

        // Add pagination
        const pagination = new Paginate().parseRequest(this.context.getRequest())

        if(pagination.getPage()) {
            response.meta.page = pagination.getPage();
            response.meta.nextPage = response.meta.page + 1;
            response.meta.previousPage = response.meta.page - 1;
        }


        if(pagination.getPageSize()) {
            response.meta.pageSize = pagination.getPageSize();
        }

        this.jsonResponse(response, code);

    }

}

export default ResourceController;