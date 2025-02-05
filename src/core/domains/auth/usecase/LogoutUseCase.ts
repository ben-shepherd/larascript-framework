
import UnauthorizedError from "../../auth-legacy/exceptions/UnauthorizedError";
import HttpContext from "../../http/context/HttpContext";
import ApiResponse from "../../http/response/ApiResponse";
import { authJwt } from "../services/JwtAuthService";

class UserUseCase {

    /**
     * Handle the user use case
     * @param context The HTTP context
     * @returns The API response
     */

    async handle(context: HttpContext): Promise<ApiResponse> {
        const apiToken = context.getApiToken();

        if(!apiToken) {
            throw new UnauthorizedError();
        }

        await authJwt().revokeToken(apiToken);

        return new ApiResponse().setCode(204)
    }

}


export default UserUseCase;


