import GetProfileUseCase from "@src/app/useCases/auth/profile/GetProfileUseCase";
import UpdateProfileUseCase from "@src/app/useCases/auth/profile/UpdateProfileUseCase";
import Controller from "@src/core/domains/http/base/Controller";
import HttpContext from "@src/core/domains/http/context/HttpContext";

class GetProfileController extends Controller {
    
    update = new UpdateProfileUseCase()

    profile = new GetProfileUseCase()

    async invoke(context: HttpContext) {
        try {
            await this.update.invoke(context)

            const response = await this.profile.invoke(context)

            this.jsonResponse(response.getData(), response.getCode())
        }
        catch (err) {
            this.serverError((err as Error).message)
        }
    }

}

export default GetProfileController;