import BadResponseException from "@src/app/errors/BadResponseException";
import { IUseCase } from "@src/app/interfaces/UseCases";
import GetUserProfile, { GetUserProfileResponse } from "@src/app/services/auth/GetUserProfile";
import HttpContext from "@src/core/domains/http/context/HttpContext";
import ApiResponse from "@src/core/domains/http/response/ApiResponse";

class GetProfileUseCase implements IUseCase {

    protected service = new GetUserProfile()

    async invoke(context: HttpContext): Promise<ApiResponse<GetUserProfileResponse>> {
        const user = context.getUser()

        if(!user) {
            throw new BadResponseException('User not found')
        }

        return await this.service.getApiResponse(user)
    }

}

export default GetProfileUseCase