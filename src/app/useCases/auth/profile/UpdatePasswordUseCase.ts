import { IUseCase } from "@src/app/interfaces/UseCases";
import User from "@src/app/models/auth/User";
import { cryptoService } from "@src/core/domains/crypto/service/CryptoService";
import HttpContext from "@src/core/domains/http/context/HttpContext";
import ValidationError from "@src/core/exceptions/ValidationError";

type PasswordBody = {
    password?: string;
    confirmPassword?: string
}

class UpdatePasswordUseCase implements IUseCase {

    static minPasswordLength() {
        return 8
    }

    async invoke(context: HttpContext) {
        if(!this.validate(context)) {
            return;
        }
        await this.updateUser(context)
    }

    protected async updateUser(context: HttpContext) {
        const data = context.getBody() as Required<PasswordBody>
        const user = context.getUser() as User

        const {
            password
        } = data

        await user.fill({
            [User.HASHED_PASSWORD]: cryptoService().hash(password),
            [User.PASSWORD_CHANGED_AT]: new Date(),
        })
        await user.save()
    }

    protected validate(context: HttpContext): boolean {
        const data = context.getBody() as PasswordBody
        const {
            password,
            confirmPassword
        } = data


        if(!password || (typeof password === 'string' && password?.length === 0)) {
            return false;
        }

        const pwdsAreStrings = typeof password === 'string' && typeof confirmPassword === 'string'
        const pwdsMatch = password === confirmPassword
        const pwdMinLength = typeof password === 'string' && password.length >= UpdatePasswordUseCase.minPasswordLength()

        if(!pwdsAreStrings) {
            throw new ValidationError('Missing a confirmation password')
        }

        if(!pwdsMatch) {
            throw new ValidationError('Passwords do not match')
        }

        if (!pwdMinLength) {
            const min = UpdatePasswordUseCase.minPasswordLength().toString()
            throw new ValidationError('Passwords must have a minimum of ' + min + ' characters')
        }

        return true
    }

}

export default UpdatePasswordUseCase