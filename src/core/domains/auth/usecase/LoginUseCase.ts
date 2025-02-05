
import UnauthorizedError from "../../auth-legacy/exceptions/UnauthorizedError";
import HttpContext from "../../http/context/HttpContext";
import ApiResponse from "../../http/response/ApiResponse";
import { authJwt } from "../services/JwtAuthService";
import comparePassword from "../utils/comparePassword";

class LoginUseCase {

    /**
     * Handle the login use case

     * @param context The HTTP context
     * @returns The API response
     */
    async handle(context: HttpContext): Promise<ApiResponse> {
        const apiResponse = new ApiResponse();

        const { email = '', password = '' } = context.getBody();

        const user = await authJwt().getUserRepository().findByEmail(email);

        if(!user) {
            return this.unauthorized('Email or password is incorrect');
        }

        const hashedPassword = user.getHashedPassword();

        if(!hashedPassword || !comparePassword(password, hashedPassword)) {
            return this.unauthorized('Email or password is incorrect');
        }

        let jwtToken!: string;

        try {
            jwtToken = await authJwt().attemptCredentials(email, password);
        }

        catch (error) {
            if(error instanceof UnauthorizedError) {
                return this.unauthorized('Email or password is incorrect');
            }
            throw error;
        }

        const userAttributes = await user.toObject({ excludeGuarded: true });

        return apiResponse.setData({
            token: jwtToken,
            user: userAttributes
        }).setCode(201);

    }

    /**
     * Unauthorized response
     * @param message The message
     * @returns The API response
     */
    unauthorized(message = 'Unauthorized') {
        return new ApiResponse().setCode(401).setData({
            message
        });
    }


}


export default LoginUseCase;


