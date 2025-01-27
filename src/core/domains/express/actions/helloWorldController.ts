import Controller from "../base/Controller";
import HttpContext from "../data/HttpContext";

export class HelloWorldController extends Controller {

    protected genericResponse(context: HttpContext, message: string) {      
        this.jsonResponse({
            message,
            queryParams: context.getQueryParams(),
            bodyParams: context.getBody(),
            method: context.getMethod(),
        })
    }

    public index() {
        this.genericResponse(this.context, '(index): Hello World!')
    }

    public show() {
        this.genericResponse(this.context, '(show): Hello World!')
    }

    public create() {
        this.genericResponse(this.context, '(create): Hello World!')
    }

    public update() {
        this.genericResponse(this.context, '(update): Hello World!')
    }

    public delete() {
        this.genericResponse(this.context, '(delete): Hello World!')
    }

    public helloWorld() {
        this.genericResponse(this.context, '(helloWorld): Hello World!')
    }

}

export default HelloWorldController