
import UnauthorizedError from "../../auth-legacy/exceptions/UnauthorizedError";
import HttpContext from "../../http/context/HttpContext";
import ApiResponse from "../../http/response/ApiResponse";
import IValidatorResult from "../../validator/interfaces/IValidatorResult";
import { auth } from "../services/AuthService";

class UpdateUseCase {

    /**
     * Handle the user update use case
     * @param context The HTTP context
     * @returns The API response
     */

    async handle(context: HttpContext): Promise<ApiResponse> {
        const userId = context.getUser()?.getId();

        if(!userId) {
            throw new UnauthorizedError();
        }

        const validationResult = await this.validate(context);

        if(!validationResult.success) {
            return new ApiResponse().setCode(422).setData({
                errors: validationResult.joi.error?.details
            })
        }

        const user = await auth().getJwtAdapter().getUserRepository().findByIdOrFail(userId);

        // Update the user and save
        user.fill(context.getBody());
        await user.save();


        // Get the user attributes
        const userAttributes = await user.toObject({ excludeGuarded: true})

        return new ApiResponse().setData({
            user: userAttributes
        }).setCode(200)
    }

    /**
     * Validate the request body
     * @param context The HTTP context
     * @returns The validation result
     */
    async validate(context: HttpContext): Promise<IValidatorResult<any>> {
        const validatorConstructor = auth().getJwtAdapter().config.validators.updateUser
        const validator = new validatorConstructor();
        return await validator.validate(context.getBody());
    }

}


export default UpdateUseCase;


