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

    public async index(): Promise<void> {
        const result = await this.indexService.handler(this.context)
        this.jsonResponse(result)
    }

    public async show(): Promise<void> {
        const result = await this.showService.handler(this.context)
        this.jsonResponse(result)
    }

    public async create(): Promise<void> {
        const result = await this.createService.handler(this.context)
        this.jsonResponse(result)
    }

    public async update(): Promise<void> {
        const result = await this.updateService.handler(this.context)
        this.jsonResponse(result)
    }

    public async delete(): Promise<void> {
        const result = await this.deleteService.handler(this.context)
        this.jsonResponse(result)
    }

}

export default ResourceController;