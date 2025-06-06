/* eslint-disable no-unused-vars */
import { IRule, IRulesObject } from "@src/core/domains/validator/interfaces/IRule"
import { IValidatorResult } from "@src/core/domains/validator/interfaces/IValidatorResult"

import { IHasHttpContext } from "@src/core/domains/http/interfaces/IHttpContext"


export type CustomValidatorConstructor = {
    new (...args: any[]): IValidator
}

export type ValidatorConstructor = {
    new (rules: IRule[], messages: IValidatorMessages): IValidator
    make(rules: IRule[], messages: IValidatorMessages): IValidator
}

export type IValidatorMessages = Record<string, string>

export type IValidatorAttributes = Record<string, unknown>

export type IValidatorErrors = Record<string, string[]>

export type IValidatorFn = (rules: IRulesObject, messages?: IValidatorMessages) => IValidator

export interface IValidator<Attributes extends IValidatorAttributes = IValidatorAttributes> extends IHasHttpContext {
    validate(data: Attributes): Promise<IValidatorResult<Attributes>>
    passes(): boolean
    errors(): IValidatorErrors
    validated(): Attributes;
    getRules(): IRulesObject;
    getMessages(): IValidatorMessages;
}



