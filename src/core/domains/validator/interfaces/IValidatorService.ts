import { NextFunction, Request, Response } from "express";
import IValidator from "./IValidator";

interface IValidatorService<T = any> {
    validator(rules?: object): IValidator<T>;
    middleware(): (validator: IValidator) => (req: Request, res: Response, next: NextFunction) => Promise<void>;
}

export default IValidatorService