
import { ValidatorConstructor } from "@src/core/domains/validator/interfaces/IValidatorService";

export default interface IValidatorRequest {
    validatorConstructor?: ValidatorConstructor;
}
