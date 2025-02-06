/* eslint-disable no-unused-vars */
import IValidator from "@src/core/domains/validator-legacy/interfaces/IValidator";
import { ICtor } from "@src/core/interfaces/ICtor";

import { TExpressMiddlewareFnOrClass } from "../../http/interfaces/IMiddleware";

export interface ValidatorMiddlewareProps {
    validatorConstructor: ValidatorConstructor,
    validateBeforeAction?: boolean
}

export type ValidatorConstructor = ICtor<IValidator>

interface IValidatorService<T = any> {
    validator(rules?: object): IValidator<T>;
    middleware(): TExpressMiddlewareFnOrClass;
}

export default IValidatorService