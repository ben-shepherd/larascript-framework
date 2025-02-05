import ForbiddenResourceError from "../../auth-legacy/exceptions/ForbiddenResourceError";
import UnauthorizedError from "../../auth-legacy/exceptions/UnauthorizedError";
import Controller from "../../http/base/Controller";
import HttpContext from "../../http/context/HttpContext";
import responseError from "../../http/handlers/responseError";
import ApiResponse from "../../http/response/ApiResponse";
import ValidationError from "../../validator/exceptions/ValidationError";
import LoginUseCase from "../usecase/LoginUseCase";
import LogoutUseCase from "../usecase/LogoutUseCase";
import RefreshUseCase from "../usecase/RefreshUseCase";
import RegisterUseCase from "../usecase/RegisterUseCase";
import UpdateUseCase from "../usecase/UpdateUseCase";
import UserUseCase from "../usecase/UserUseCase";

/**
 * Controller handling authentication-related HTTP endpoints.
 * 
 * This controller manages user authentication operations including:
 * - User registration
 * - Login/authentication
 * - User profile retrieval
 * - Logout
 * - Token refresh
 * 
 * Each method handles its respective HTTP endpoint and delegates the business logic
 * to appropriate use cases while handling response formatting and error cases.
 */
class AuthController extends Controller {

    protected loginUseCase = new LoginUseCase();
    
    protected registerUseCase = new RegisterUseCase();

    protected userUseCase = new UserUseCase();
    
    protected logoutUseCase = new LogoutUseCase();

    protected refreshUseCase = new RefreshUseCase();

    protected updateUseCase = new UpdateUseCase();

    /**
     * Handle the login endpoint

     * @param context The HTTP context
     * @returns The API response
     */
    async login(context: HttpContext) {
        this.handler(context, async () => {
            return await this.loginUseCase.handle(context)
        })
    }


    /**
     * Handle the register endpoint
     * @param context The HTTP context
     * @returns The API response
     */
    async register(context: HttpContext) {
        this.handler(context, async () => {
            return await this.registerUseCase.handle(context)
        })
    }

    /**
     * Handle the user endpoint
     * @param context The HTTP context
     * @returns The API response
     */
    async user(context: HttpContext) {
        this.handler(context, async () => {
            return await this.userUseCase.handle(context)
        })
    }


    /**
     * Handle the logout endpoint
     * @param context The HTTP context
     * @returns The API response
     */
    async logout(context: HttpContext) {
        this.handler(context, async () => {
            return await this.logoutUseCase.handle(context)
        })
    }



    /**
     * Handle the refresh endpoint
     * @param context The HTTP context
     * @returns The API response
     */
    async refresh(context: HttpContext) {
        this.handler(context, async () => {
            return await this.refreshUseCase.handle(context)
        })
    }

    async update(context: HttpContext) {
        this.handler(context, async () => {
            return await this.updateUseCase.handle(context)
        })
    }

    /**
     * Handle the request
     * @param context The HTTP context
     * @param callback The callback to handle the request
     * @returns The API response

     */
    protected async handler(context: HttpContext, callback: () => Promise<ApiResponse>) {
        try {
            const apiResponse = await callback();

            return this.jsonResponse(
                apiResponse.toObject(),
                apiResponse.getCode()
            )
        }
        catch (error) {
            if(Error instanceof UnauthorizedError) {
                responseError(context.getRequest(), context.getResponse(), error as Error, 401)
                return;
            }

            if(error instanceof ValidationError) {
                responseError(context.getRequest(), context.getResponse(), error as Error, 422)
                return;
            }

            if(error instanceof ForbiddenResourceError) {
                responseError(context.getRequest(), context.getResponse(), error as Error, 403)
                return;
            }

            responseError(context.getRequest(), context.getResponse(), error as Error)
        }

    }

}

export default AuthController;
