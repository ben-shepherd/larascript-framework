
import { ValidatorConstructor } from "@src/core/domains/validator-legacy/interfaces/IValidatorService";
import { Request } from "express";

export default interface IValidatorRequest extends Request {
    validatorConstructor?: ValidatorConstructor;
}
