import GetProfileUseCase from "@src/app/useCases/auth/profile/GetProfileUseCase"
import UnauthorizedError from "@src/core/domains/auth/exceptions/UnauthorizedError"
import { IUserModel } from "@src/core/domains/auth/interfaces/models/IUserModel"
import AuthLoginUseCase from "@src/core/domains/auth/usecase/LoginUseCase"
import HttpContext from "@src/core/domains/http/context/HttpContext"
import ApiResponse from "@src/core/domains/http/response/ApiResponse"

class LoginUseCase {

    protected login = new AuthLoginUseCase()

    protected getProfile = new GetProfileUseCase()

    async invoke(context: HttpContext) {
        try {
            const loginResponse = await this.login.handle(context)

            if (loginResponse.getCode() !== 200) {
                return new ApiResponse()
                    .setData(loginResponse.getData())
                    .setCode(loginResponse.getCode())
            }

            const loginResponseData = loginResponse.getData() as { user?: IUserModel['attributes'] }
            const user = loginResponseData?.user ?? null
            const userId = (user?.id ?? null) as string

            if (!user || typeof userId !== 'string') {
                return new ApiResponse({
                    message: 'Unable to determine logged in user'
                }, 422)
            }

            const userProfile = await this.getProfile.getFromUserId(userId)

            if (!userProfile) {
                return new ApiResponse({
                    message: 'Unable to fetch user profile data'
                }, 422)
            }

            const dataWithToken = {
                ...userProfile.getData(),
                token: (loginResponse.getData() as { token: string }).token
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

export default LoginUseCase