
import HttpContext from "../../http/context/HttpContext";
import ApiResponse from "../../http/response/ApiResponse";
import UnauthorizedError from "../exceptions/UnauthorizedError";
import { authJwt } from "../services/JwtAuthService";

/**
 * RefreshUseCase handles JWT token refresh requests
 * 
 * This class is responsible for:
 * - Validating the user has a valid existing API token
 * - Generating a new JWT token via JwtAuthService's refresh mechanism
 * - Returning the new token in the response
 * 
 */

class RefreshUseCase {

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

        const refreshedToken = authJwt().refreshToken(apiToken);

        return new ApiResponse().setData({
            token: refreshedToken
        }).setCode(200)

    }

}


export default RefreshUseCase;


