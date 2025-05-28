import BadResponseException from "@src/app/errors/BadResponseException";
import { IUseCase } from "@src/app/interfaces/UseCases";
import GetUserProfile, { GetUserProfileResponse } from "@src/app/services/auth/GetUserProfile";
import { IUserModel } from "@src/core/domains/auth/interfaces/models/IUserModel";
import { auth } from "@src/core/domains/auth/services/AuthService";
import HttpContext from "@src/core/domains/http/context/HttpContext";
import ApiResponse from "@src/core/domains/http/response/ApiResponse";

type GetProfileUseCaseResponse = ApiResponse<GetUserProfileResponse>

class GetProfileUseCase implements IUseCase {

    protected service = new GetUserProfile()

    /**
     * Get user profile by user id
     */
    async getFromUserId(userId: string): Promise<GetProfileUseCaseResponse | undefined> {
        const user = await auth().getUserRepository().findById(userId)

        if(!user) {
            return undefined
        }

        return await this.getFromUser(user)
    }

    /**
     * Get user profile from user model
     */
    async getFromUser(user: IUserModel): Promise<GetProfileUseCaseResponse> {
        return await this.service.getApiResponse(user)
    }

    /**
     * Default behaviour, get user profile from authenticated user
     */
    async invoke(context: HttpContext): Promise<GetProfileUseCaseResponse> {
        const user = context.getUser()

        if(!user) {
            throw new BadResponseException('User not found')
        }

        return this.getFromUser(user)
    }

}

export default GetProfileUseCase