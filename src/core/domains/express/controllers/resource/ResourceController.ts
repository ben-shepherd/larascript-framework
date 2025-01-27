import Controller from "../../base/Controller";
import ResourceIndexService from "../../services/Resources/ResourceIndexService";

class ResourceController  extends Controller {

    protected indexService = new ResourceIndexService();

    public index(): void {
        this.jsonResponse(
            this.indexService.handler(this.context)
        )
    }

    public show(): void {
        this.jsonResponse({
            message: 'show',
            queryParams: this.context.getQueryParams(),
            body: this.context.getBody()
        })
    }

    public create(): void {
        this.jsonResponse({
            message: 'create',
            queryParams: this.context.getQueryParams(),
            body: this.context.getBody()
        })
    }

    public update(): void {
        this.jsonResponse({
            message: 'update',
            queryParams: this.context.getQueryParams(),
            body: this.context.getBody()
        })
    }

    public delete(): void {
        this.jsonResponse({
            message: 'delete',
            queryParams: this.context.getQueryParams(),
            body: this.context.getBody()
        })
    }

}

export default ResourceController;