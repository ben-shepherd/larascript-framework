/* eslint-disable no-unused-vars */
export interface IRuleConstructor {
    new (...args: any[]): IRule
}

export interface IRule {
    validate(value: unknown, attributes: Record<string, unknown>): boolean
}
