import Middleware from "@src/core/domains/http/base/Middleware";
import HttpContext from "@src/core/domains/http/context/HttpContext";
import { CustomValidatorConstructor } from "@src/core/domains/validator/interfaces/IValidator";

/**
 * Validator middleware for validating the request body
 * 
 * This middleware validates the request body against the validator constructor
 * and sets the validated body on the request.
 */
class ValidatorMiddleware extends Middleware {

    /**
     * Executes the validator middleware
     * @param context - The HTTP context
     */
    public async execute(context: HttpContext): Promise<void> {
        const validatorConstructor = this.getValidatorConstructor(context);
       
        // No validator constructor, skip validation
        if(!validatorConstructor) {
            this.next();
            return;
        }

        const validator = new validatorConstructor();
        const result = await validator.validate(context.getRequest().body);

        // Validation failed, return the errors
        if(result.fails()) {
            context.getResponse().status(422).json({
                errors: result.errors()
            });
            return;
        }

        // Set the validated body on the request
        context.getRequest().body = result.validated();

        this.next();
    }

    /**
     * Get the validator constructor from the route item
     * @param context - The HTTP context
     * @returns The validator constructor
     */
    protected getValidatorConstructor(context: HttpContext): CustomValidatorConstructor | undefined {
        return context.getRouteItem()?.validator;
    }

}

export default ValidatorMiddleware;
