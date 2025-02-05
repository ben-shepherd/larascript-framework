import HttpContext from "../../http/context/HttpContext";
import ApiResponse from "../../http/response/ApiResponse";
import IValidatorResult from "../../validator/interfaces/IValidatorResult";
import { IUserModel } from "../interfaces/models/IUserModel";
import { acl, auth } from "../services/AuthService";
import { authJwt } from "../services/JwtAuthService";
import hashPassword from "../utils/hashPassword";

/**
 * RegisterUseCase handles new user registration
 * 
 * This class is responsible for:
 * - Validating user registration data via configured validator
 * - Creating new user records with hashed passwords
 * - Assigning default groups and roles to new users
 * - Saving user data to the configured user repository
 * 
 */
class RegisterUseCase {

    /**
     * Handle the register use case
     * @param context The HTTP context
     * @returns The API response
     */
    async handle(context: HttpContext): Promise<ApiResponse> {
        const apiResponse = new ApiResponse();
        const validationResult = await this.validate(context);

        if(!validationResult.success) {
            return apiResponse.setCode(422).setData({
                errors: validationResult.joi.error?.details ?? []
            });
        }

        if(this.validateUserAndPasswordPresent(context, apiResponse).getCode() !== 200) {
            return apiResponse;
        }

        const createdUser = await this.createUser(context);
        const userAttributes = await createdUser.toObject({ excludeGuarded: true });

        return apiResponse.setData(userAttributes).setCode(201);
    }

    /**
     * Create a user
     * @param context The HTTP context
     * @returns The user
     */
    async createUser(context: HttpContext): Promise<IUserModel> {
        const userAttributes = {
            email: context.getBody().email,

            hashedPassword: hashPassword(context.getBody().password),
            groups: [acl().getDefaultGroup().name],
            roles: [acl().getGroupRoles(acl().getDefaultGroup()).map(role => role.name)],
            ...context.getBody()

        }

        // Create and save the user
        const user = authJwt().getUserRepository().create(userAttributes);
        await user.save();

        return user;
    }


    /**
     * Validate the user and password are present
     * @param context The HTTP context
     * @param apiResponse The API response
     * @returns The API response
     */
    validateUserAndPasswordPresent(context: HttpContext, apiResponse: ApiResponse): ApiResponse {
        const {
            email = null,

            password = null
        } = context.getBody();

        if(!email || !password) {
            apiResponse.setCode(422).setData({
                errors: [{
                    message: 'Email and password are required'
                }]
            });
        }

        return apiResponse;
    }

    /**
     * Validate the request body
     * @param context The HTTP context
     * @returns The validation result
     */

    async validate(context: HttpContext): Promise<IValidatorResult<any>> {
        const validatorConstructor = auth().getJwtAdapter().config.validators.createUser
        const validator = new validatorConstructor();
        return await validator.validate(context.getBody());
    }


}


export default RegisterUseCase;

