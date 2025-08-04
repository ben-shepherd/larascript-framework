import Controller from "@src/core/domains/http/base/Controller";
import HttpContext from "@src/core/domains/http/context/HttpContext";

class WelcomeController extends Controller {

    async invoke(context: HttpContext) {
        this.render('welcome', {
            title: 'Welcome to Larascript Framework',
            requestId: context.getRequest().id,
        })
    }

}

export default WelcomeController;
