/* eslint-disable no-unused-vars */
import IValidator from "@src/core/domains/validator/interfaces/IValidator";
import { NextFunction, Request, Response } from "express";

export interface ValidatorMiddlewareProps {
    validator: IValidator,
    validateBeforeAction?: boolean
}

interface IValidatorService<T = any> {
    validator(rules?: object): IValidator<T>;
    middleware(): ({validator, validateBeforeAction }: ValidatorMiddlewareProps) => (req: Request, res: Response, next: NextFunction) => Promise<void>;
}

export default IValidatorService