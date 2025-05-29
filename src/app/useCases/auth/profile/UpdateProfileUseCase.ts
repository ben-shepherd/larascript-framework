import { IUseCase } from "@src/app/interfaces/UseCases";
import { UserAttributes } from "@src/app/models/auth/User";
import { IUserModel } from "@src/core/domains/auth/interfaces/models/IUserModel";
import HttpContext from "@src/core/domains/http/context/HttpContext";

class UpdateProfileUseCase implements IUseCase {

    async invoke(context: HttpContext) {
        const user = context.getUser() as IUserModel
        const body = context.getBody() as Partial<UserAttributes>

        const {
            firstName,
            lastName
        } = body

        await user.fill({
            firstName,
            lastName
        })
        await user.save()
    }

}

export default UpdateProfileUseCase