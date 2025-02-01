import ForbiddenResourceError from "@src/core/domains/auth/exceptions/ForbiddenResourceError";
import UnauthorizedError from "@src/core/domains/auth/exceptions/UnauthorizedError";
import Controller from "@src/core/domains/express/base/Controller";
import ResourceCreateService from "@src/core/domains/express/services/Resources/ResourceCreateService";
import ResourceDeleteService from "@src/core/domains/express/services/Resources/ResourceDeleteService";
import ResourceIndexService from "@src/core/domains/express/services/Resources/ResourceIndexService";
import ResourceShowService from "@src/core/domains/express/services/Resources/ResourceShowService";
import ResourceUpdateService from "@src/core/domains/express/services/Resources/ResourceUpdateService";

import HttpContext from "../../data/HttpContext";
import { TRouteItem } from "../../interfaces/IRoute";
import responseError from "../../requests/responseError";
import BaseResourceService from "../../services/Resources/BaseResourceService";

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
     * @param {BaseResourceService} service - The service
     * @returns {Promise<void>}
     */
    protected async handler(context: HttpContext, service: BaseResourceService) {
        try {
            const routeItem = context.getRouteItem() as TRouteItem

            console.log('[Express] resource handler', {
                path: routeItem.path,
                method: routeItem.method,
                resource: service.routeResourceType,
                details: {
                    security: routeItem.security?.map(security => {
                        return {
                            id: security.getId(),
                            options: JSON.stringify(security.getRuleOptions())
                        }
                    }),
                    filters: {
                        show: routeItem.resource?.filters?.show ?? {},
                        index: routeItem.resource?.filters?.index ?? {}
                    },
                    searching: JSON.stringify(routeItem.resource?.searching ?? {})
                }
            })

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
                return;
            }
    
            responseError(context.getRequest(), context.getResponse(), error as Error)

        }
    }

}

export default ResourceController;