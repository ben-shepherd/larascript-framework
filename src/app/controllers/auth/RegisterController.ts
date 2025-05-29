import RegisterUseCase from "@src/app/useCases/auth/RegisterUseCase";
import Controller from "@src/core/domains/http/base/Controller";
import HttpContext from "@src/core/domains/http/context/HttpContext";

class RegisterController extends Controller {

    protected register = new RegisterUseCase()

    async invoke(context: HttpContext) {
        const response = await this.register.invoke(context)

        this.jsonResponse(
            response.toObject(),
            response.getCode()
        )
    }

}

export default RegisterController