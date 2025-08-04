import Controller from "@src/core/domains/http/base/Controller";
import HttpContext from "@src/core/domains/http/context/HttpContext";

class WelcomeController extends Controller {

    async invoke(context: HttpContext) {
        context.getResponse().render('welcome.ejs', {
            title: 'Welcome to Larascript Framework'
        })
    }

}

export default WelcomeController;
