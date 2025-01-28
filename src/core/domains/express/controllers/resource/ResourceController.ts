import ForbiddenResourceError from "@src/core/domains/auth/exceptions/ForbiddenResourceError";
import UnauthorizedError from "@src/core/domains/auth/exceptions/UnauthorizedError";
import Controller from "@src/core/domains/express/base/Controller";
import ResourceCreateService from "@src/core/domains/express/services/Resources/ResourceCreateService";
import ResourceDeleteService from "@src/core/domains/express/services/Resources/ResourceDeleteService";
import ResourceIndexService from "@src/core/domains/express/services/Resources/ResourceIndexService";
import ResourceShowService from "@src/core/domains/express/services/Resources/ResourceShowService";
import ResourceUpdateService from "@src/core/domains/express/services/Resources/ResourceUpdateService";

import HttpContext from "../../data/HttpContext";
import responseError from "../../requests/responseError";
import BaseResourceService from "../../services/Resources/BaseResourceService";

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
     * @param {BaseResourceService} service - The service
     * @returns {Promise<void>}
     */
    protected async handler(context: HttpContext, service: BaseResourceService) {
        try {
            const result = await service.handler(context)
            this.jsonResponse(result as object)
        }
        catch(error) {
            if(error instanceof UnauthorizedError) {
                responseError(context.getRequest(), context.getResponse(), error, 401)
                return;
            }
    
            if(error instanceof ForbiddenResourceError) {
                responseError(context.getRequest(), context.getResponse(), error, 403)
            }
    
            responseError(context.getRequest(), context.getResponse(), error as Error)

        }
    }

}

export default ResourceController;