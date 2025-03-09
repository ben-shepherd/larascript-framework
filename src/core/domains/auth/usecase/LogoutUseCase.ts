
import HttpContext from "@src/core/domains/http/context/HttpContext";
import ApiResponse from "@src/core/domains/http/response/ApiResponse";
import UnauthorizedError from "@src/core/domains/auth/exceptions/UnauthorizedError";
import { authJwt } from "@src/core/domains/auth/services/JwtAuthService";

/**
 * LogoutUseCase handles user logout by revoking their JWT token
 * 
 * This class is responsible for:
 * - Validating the user has a valid API token
 * - Revoking/invalidating the JWT token via JwtAuthService
 * - Returning a successful empty response
 */
class LogoutUseCase {

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


export default LogoutUseCase;


