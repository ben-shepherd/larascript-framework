import Controller from "../../http/base/Controller";
import HttpContext from "../../http/context/HttpContext";
import RegisterUseCase from "../usecase/RegisterUseCase";

class AuthController extends Controller {

    protected registerUseCase = new RegisterUseCase();

    async login(context: HttpContext) {
        this.jsonResponse(
            (await this.registerUseCase.handle(context)).toObject()
        )
    }
    
    async register(context: HttpContext) {
        this.jsonResponse(
            (await this.registerUseCase.handle(context)).toObject()
        )
    }

    async user(context: HttpContext) {
        this.jsonResponse(
            (await this.registerUseCase.handle(context)).toObject()
        )
    }

    async logout(context: HttpContext) {
        this.jsonResponse(
            (await this.registerUseCase.handle(context)).toObject()
        )
    }

    
    async refresh(context: HttpContext) {
        this.jsonResponse(
            (await this.registerUseCase.handle(context)).toObject()
        )
    }

    
    
}

export default AuthController;
