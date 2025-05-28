import ClearAvatarUseCase from "@src/app/useCases/auth/profile/ClearAvatarUseCase";
import Controller from "@src/core/domains/http/base/Controller";
import HttpContext from "@src/core/domains/http/context/HttpContext";

class ClearAvatarController extends Controller {
    
    useCase = new ClearAvatarUseCase()

    async invoke(context: HttpContext) {
        try {
            await this.useCase.invoke(context)
            
            this.jsonResponse({}, 204)
        }
        catch (err) {
            this.serverError((err as Error).message)
        }
    }

}

export default ClearAvatarController;