import { IUseCase } from "@src/app/interfaces/UseCases";
import { UserAttributes } from "@src/app/models/auth/User";
import { IUserModel } from "@src/core/domains/auth/interfaces/models/IUserModel";
import HttpContext from "@src/core/domains/http/context/HttpContext";
import ValidationError from "@src/core/exceptions/ValidationError";

import UpdatePasswordUseCase from "./UpdatePasswordUseCase";

class UpdateProfileUseCase implements IUseCase {

    updatePassword = new UpdatePasswordUseCase()

    protected async updateUser(context: HttpContext) {
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

    async invoke(context: HttpContext) {
        try {
            await this.updatePassword.invoke(context)
        }
        catch (err) {
            if(err instanceof ValidationError) {
                throw err
            }
        }

        await this.updateUser(context)
    }

}

export default UpdateProfileUseCase