import GetProfileUseCase from "@src/app/useCases/auth/profile/GetProfileUseCase";
import UpdatePasswordUseCase from "@src/app/useCases/auth/profile/UpdatePasswordUseCase";
import UpdateProfileUseCase from "@src/app/useCases/auth/profile/UpdateProfileUseCase";
import Controller from "@src/core/domains/http/base/Controller";
import HttpContext from "@src/core/domains/http/context/HttpContext";
import ValidationError from "@src/core/exceptions/ValidationError";

class GetProfileController extends Controller {

    protected updatePassword = new UpdatePasswordUseCase()
    
    protected updateProfile = new UpdateProfileUseCase()

    protected getProfile = new GetProfileUseCase()

    async invoke(context: HttpContext) {
        try {
            await this.updatePassword.invoke(context)

            await this.updateProfile.invoke(context)

            const response = await this.getProfile.invoke(context)

            this.jsonResponse(response.getData(), response.getCode())
        }
        catch (err) {
            if(err instanceof ValidationError) {
                this.badRequest(err.message)
            }

            this.serverError((err as Error).message)
        }
    }

}

export default GetProfileController;