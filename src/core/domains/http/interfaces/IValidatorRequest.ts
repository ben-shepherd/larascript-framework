
import { ValidatorConstructor } from "@src/core/domains/validator-legacy/interfaces/IValidatorService";

export default interface IValidatorRequest {
    validatorConstructor?: ValidatorConstructor;
}
