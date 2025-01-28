import Controller from "../../base/Controller";
import ResourceCreateService from "../../services/Resources/ResourceCreateService";
import ResourceDeleteService from "../../services/Resources/ResourceDeleteService";
import ResourceIndexService from "../../services/Resources/ResourceIndexService";
import ResourceShowService from "../../services/Resources/ResourceShowService";
import ResourceUpdateService from "../../services/Resources/ResourceUpdateService";

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
        const result = await this.indexService.handler(this.context)
        this.jsonResponse(result)
    }

    /**
     * @description Get a resource by id
     * @returns {Promise<void>}
     */
    public async show(): Promise<void> {
        const result = await this.showService.handler(this.context)
        this.jsonResponse(result)
    }

    /**
     * @description Create a resource
     * @returns {Promise<void>}
     */
    public async create(): Promise<void> {
        const result = await this.createService.handler(this.context)
        this.jsonResponse(result)
    }

    /**
     * @description Update a resource
     * @returns {Promise<void>}
     */
    public async update(): Promise<void> {
        const result = await this.updateService.handler(this.context)
        this.jsonResponse(result)
    }

    /**
     * @description Delete a resource
     * @returns {Promise<void>}
     */
    public async delete(): Promise<void> {
        const result = await this.deleteService.handler(this.context)
        this.jsonResponse(result)
    }

}

export default ResourceController;