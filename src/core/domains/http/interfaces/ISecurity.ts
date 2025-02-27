/* eslint-disable no-unused-vars */
import HttpContext from '@src/core/domains/http/context/HttpContext';
import { Request } from 'express';

export type TSecurityRuleOptions<RuleOptions extends object = object> = {
    id: string;
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
    execute(context: HttpContext, ...args: any[]): Promise<boolean>
}

export interface ISecurityRequest extends Request {
    security?: ISecurityRule[]
}