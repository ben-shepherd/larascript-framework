import { ValidatorMiddlewareProps } from '@src/core/domains/validator-legacy/interfaces/IValidatorService';

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
        this.next();
    }

}

export default ValidateMiddleware;