import { CustomValidatorConstructor } from "@src/core/domains/validator/interfaces/IValidator";

export interface IValidatorRequest {
    validator?: CustomValidatorConstructor
}