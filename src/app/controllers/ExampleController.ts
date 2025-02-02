import Controller from "@src/core/domains/http/base/Controller";

class ExampleController extends Controller {

    async example() {
        const context = this.context;
        
        this.jsonResponse({ 
            id: context.getId(),
            message: 'OK!',
        }, 200)
    }

}

export default ExampleController;
