/* eslint-disable no-unused-vars */
import IValidator from "@src/core/domains/validator/interfaces/IValidator";
import { ICtor } from "@src/core/interfaces/ICtor";
import { NextFunction, Request, Response } from "express";

export interface ValidatorMiddlewareProps {
    validatorConstructor: ValidatorConstructor,
    validateBeforeAction?: boolean
}

export type ValidatorConstructor = ICtor<IValidator>

interface IValidatorService<T = any> {
    validator(rules?: object): IValidator<T>;
    middleware(): ({validatorConstructor, validateBeforeAction }: ValidatorMiddlewareProps) => (req: Request, res: Response, next: NextFunction) => Promise<void>;
}

export default IValidatorService