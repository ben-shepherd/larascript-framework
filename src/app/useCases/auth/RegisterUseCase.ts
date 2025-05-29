import { UserAttributes } from "@src/app/models/auth/User"
import GetProfileUseCase from "@src/app/useCases/auth/profile/GetProfileUseCase"
import UnauthorizedError from "@src/core/domains/auth/exceptions/UnauthorizedError"
import { auth } from "@src/core/domains/auth/services/AuthService"
import AuthRegisterUseCase from "@src/core/domains/auth/usecase/RegisterUseCase"
import HttpContext from "@src/core/domains/http/context/HttpContext"
import ApiResponse from "@src/core/domains/http/response/ApiResponse"

class RegisterUseCase {

    protected register = new AuthRegisterUseCase()

    protected getProfile = new GetProfileUseCase()

    async invoke(context: HttpContext) {
        try {
            const registerResponse = await this.register.handle(context)

            if (registerResponse.getCode() !== 201) {
                return new ApiResponse()
                    .setData(registerResponse.getData())
                    .setCode(registerResponse.getCode())
            }

            const registerResponseData = registerResponse.getData() as UserAttributes
            const userId = (registerResponseData?.id ?? null) as string

            if (!registerResponseData || typeof userId !== 'string') {
                return new ApiResponse({
                    message: 'Unable to determine registered user'
                }, 422)
            }

            // Create a token
            const user = await auth().getUserRepository().findByIdOrFail(userId)
            const token = await auth().getDefaultAdapter().createJwtFromUser(user)

            // Fetch profile
            const userProfile = await this.getProfile.getFromUserId(userId)

            if (!userProfile) {
                return new ApiResponse({
                    message: 'Unable to fetch user profile data'
                }, 422)
            }

            const dataWithToken = {
                ...userProfile.getData(),
                token
            }

            return new ApiResponse()
                .setData(dataWithToken)
                .setCode(200)
        }
        catch (err) {
            if (err instanceof UnauthorizedError) {
                return new ApiResponse({
                    message: 'Incorrect username or password'
                }, 401)
            }

            return new ApiResponse({
                message: (err as Error).message
            }, 500)
        }
    }

}

export default RegisterUseCase