
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
        const userId = context.getUser()?.getId();

        if(!userId) {
            throw new UnauthorizedError();
        }

        const user = await authJwt().getUserRepository().findById(userId);

        if(!user) {
            throw new UnauthorizedError();
        }

        return new ApiResponse().setData(user.toObject({ excludeGuarded: true }));
    }

}


export default UserUseCase;


