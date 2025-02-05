
import HttpContext from "../../http/context/HttpContext";
import ApiResponse from "../../http/response/ApiResponse";
import UnauthorizedError from "../exceptions/UnauthorizedError";
import { authJwt } from "../services/JwtAuthService";

/**
 * UserUseCase handles retrieving the authenticated user's profile
 * 
 * This class is responsible for:
 * - Validating that the user is authenticated via their JWT token
 * - Retrieving the user's data from the user repository
 * - Returning the user's profile data, excluding guarded attributes
 * 
 */
class UserUseCase {

    /**
     * Handle the user use case
     * @param context The HTTP context
     * @returns The API response
     */

    async handle(context: HttpContext): Promise<ApiResponse> {
        const userId = context.getUser()?.getId();

        if(!userId) {
            throw new UnauthorizedError();
        }

        const user = await authJwt().getUserRepository().findById(userId);

        if(!user) {
            throw new UnauthorizedError();
        }

        const userAttributes = await user.toObject({ excludeGuarded: true });

        return new ApiResponse().setData(userAttributes);
    }

}


export default UserUseCase;


