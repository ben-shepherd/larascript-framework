import Middleware from "../../http/base/Middleware";
import HttpContext from "../../http/context/HttpContext";
import { CustomValidatorConstructor } from "../interfaces/IValidator";

/**
 * Validator middleware for validating the request body
 * 
 * This middleware validates the request body against the validator constructor
 * and sets the validated body on the request.
 */
class ValidatorMiddleware extends Middleware {

    public async execute(context: HttpContext): Promise<void> {
        const validatorConstructor = this.getValidatorConstructor(context);
        
        if(!validatorConstructor) {
            this.next();
            return;
        }

        const validator = new validatorConstructor();
        const result = await validator.validate(context.getRequest().body);

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
