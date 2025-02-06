import responseError from '@src/core/domains/http/handlers/responseError';
import { ValidatorMiddlewareProps } from '@src/core/domains/validator/interfaces/IValidatorService';

import Middleware from '../../http/base/Middleware';
import HttpContext from '../../http/context/HttpContext';

/**
 * ValidateMiddleware is an Express middleware that handles request validation
 * using a validator specified in the route configuration.
 * 
 * It checks if a validator is defined for the current route and validates 
 * the request body against the validator's rules if validateBeforeAction is true.
 */
class ValidateMiddleware extends Middleware<ValidatorMiddlewareProps> {

    public async execute(context: HttpContext): Promise<void> {
        try {
            const routeItem = context.getRouteItem();
            const validatorConstructor = routeItem?.validator;
            const validateBeforeAction = routeItem?.validateBeforeAction;

            if(!validatorConstructor) {
                this.next();
                return;
            }

            const validator = new validatorConstructor();
            const body = context.getRequest().body;
    
            if(validateBeforeAction) {
                const result = await validator.validate(
                    body,
                    { 
                        stripUnknown: true,
                        ...validator.getJoiOptions() 
                    }
                );
    
                if(!result.success) {
                    context.getResponse().status(422).send({
                        success: false,
                        errors: (result.joi.error?.details ?? []).map((detail) => detail)
                    })
                    return;
                }


            }
    
            this.next();
        }
        catch (error) {
            if(error instanceof Error) {
                responseError(context.getRequest(), context.getResponse(), error)
                return;
            }

        }
    }

}

export default ValidateMiddleware;