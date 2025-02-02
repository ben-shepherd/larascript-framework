/* eslint-disable no-unused-vars */
import { Request } from 'express';

import HttpContext from '../context/HttpContext';

export type TSecurityRuleOptions<RuleOptions extends object = object> = {
    id: string;
    also?: string | null;
    when: string[] | null;
    never: string[] | null;
    ruleOptions?: RuleOptions;
}

export type TSecurityRuleConstructor<Rule extends ISecurityRule = ISecurityRule> = {
    new (...args: any[]): Rule
}

export interface ISecurityRule<RuleOptions extends object = object> {
    setRuleOptions(options: RuleOptions): ISecurityRule<RuleOptions>;
    getRuleOptions(): RuleOptions
    getId(): string
    getWhen(): string[] | null
    getNever(): string[] | null
    getAlso(): string | null
    execute(context: HttpContext, ...args: any[]): Promise<boolean>
}

/**
 * Security request to be included in BaseRequest
 */
export interface ISecurityRequest extends Request {
    security?: ISecurityRule[]
}