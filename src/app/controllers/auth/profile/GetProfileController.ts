import GetProfileUseCase from "@src/app/useCases/auth/profile/GetProfileUseCase";
import Controller from "@src/core/domains/http/base/Controller";
import HttpContext from "@src/core/domains/http/context/HttpContext";

class UpdaterAvatarController extends Controller {
    
    useCase = new GetProfileUseCase()

    async invoke(context: HttpContext) {
        try {
            const response = await this.useCase.invoke(context)

            this.jsonResponse(
                response.getData(),
                response.getCode()
            )
        }
        catch (err) {
            this.serverError((err as Error).message)
        }
    }

}

export default UpdaterAvatarController;