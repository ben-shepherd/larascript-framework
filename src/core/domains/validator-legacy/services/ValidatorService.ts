import Validator from "@src/core/domains/validator-legacy/base/Validator";
import IValidator from "@src/core/domains/validator-legacy/interfaces/IValidator";
import IValidatorService from "@src/core/domains/validator-legacy/interfaces/IValidatorService";
import { app } from "@src/core/services/App";
import Joi from "joi";

import { TExpressMiddlewareFnOrClass } from "../../http/interfaces/IMiddleware";
import ValidateMiddleware from "../middleware/ValidateMiddleware";


/**
 * Short hand for app('validate')
 * @returns 
 */
export const validate = () => app('validate');

/**
 * Validator service class
 * @implements IValidatorService
 */
class ValidatorService implements IValidatorService {

    /**
     * Creates a new validator instance with the given rules.
     * @param {Joi.ObjectSchema} rules The validation rules.
     * @returns {IValidator} The validator instance.
     */
    public validator(rules: Joi.ObjectSchema): IValidator {
        return new Validator(rules);
    }

    /**
     * Returns a middleware function that will validate the request body
     * using the validator object created by the validator method.
     * @returns {import('express').RequestHandler} The middleware function
     */
    public middleware(): TExpressMiddlewareFnOrClass {
        return ValidateMiddleware.toExpressMiddleware();
    }


}

export default ValidatorService;