import LoginUseCase from "@src/app/useCases/auth/LoginUseCase";
import Controller from "@src/core/domains/http/base/Controller";
import HttpContext from "@src/core/domains/http/context/HttpContext";

class LoginController extends Controller {

    protected login = new LoginUseCase()

    async invoke(context: HttpContext) {
        const response = await this.login.invoke(context)

        this.jsonResponse(
            response.toObject(),
            response.getCode()
        )
    }

}

export default LoginController