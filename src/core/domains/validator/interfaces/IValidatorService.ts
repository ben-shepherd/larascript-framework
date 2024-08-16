import { NextFunction, Request, Response } from "express";
import IValidator from "./IValidator";

export interface ValidatorMiddlewareProps {
    validator: IValidator,
    validateBeforeAction?: boolean
}

interface IValidatorService<T = any> {
    validator(rules?: object): IValidator<T>;
    middleware(): ({validator, validateBeforeAction }: ValidatorMiddlewareProps) => (req: Request, res: Response, next: NextFunction) => Promise<void>;
}

export default IValidatorService