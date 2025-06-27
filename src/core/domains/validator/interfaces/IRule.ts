import { IHasHttpContext } from "@src/core/domains/http/interfaces/IHttpContext"

/* eslint-disable no-unused-vars */
export interface IRuleConstructor {
    new(...args: any[]): IRule
}

export interface IRulesObject {
    [key: string]: IRule | IRule[]
}

export interface IRuleError {
    [key: string]: string[]
}


export interface IRule extends IHasHttpContext {
    setDotNotationPath(field: string): this
    getDotNotationPath(): string
    setAttributeData(data: unknown): this
    getAttributeData<T = unknown>(): T;
    setAttributes(attributes: unknown): this
    setAttribute(attribute: string): this
    getAttribute(): string;
    getAttributes<T = unknown>(): T;
    setMessages(messages: Record<string, string>): this
    setOtherRuleNames(names: string[]): this
    validate(): Promise<boolean>
    getError(): IRuleError
    getCustomError(): IRuleError | undefined
    getName(): string
}





