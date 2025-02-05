import Controller from "../../http/base/Controller";
import HttpContext from "../../http/context/HttpContext";

class AuthController extends Controller {

    login(context: HttpContext) {
        this.jsonResponse({
            message: 'Todo'
        })
    }
    
    register(context: HttpContext) {
        this.jsonResponse({
            message: 'Todo'
        })
    }

    user(context: HttpContext) {
        this.jsonResponse({
            message: 'Todo'
        })
    }

    logout(context: HttpContext) {
        this.jsonResponse({
            message: 'Todo'
        })
    }
    
    refresh(context: HttpContext) {
        this.jsonResponse({
            message: 'Todo'
        })
    }
    
    
}

export default AuthController;
