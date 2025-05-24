import Controller from "@src/core/domains/http/base/Controller";
import HttpContext from "@src/core/domains/http/context/HttpContext";

class ExampleController extends Controller {

    async example(context: HttpContext) {
        this.jsonResponse({ 
            id: context.getId(),
            message: 'Hello World!',
        }, 200)
    }
    
}

export default ExampleController;
