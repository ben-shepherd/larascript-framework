/* eslint-disable no-unused-vars */
import { BaseRequest } from '@src/core/domains/express/types/BaseRequest.t';
import { NextFunction, Request, Response } from 'express';
import { IRouteLegacy } from '@src/core/domains/express/interfaces/IRouteLegacy';

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
}

/**
 * Authorize Security props
 */
export interface ISecurityAuthorizeProps {
    throwExceptionOnUnauthorized?: boolean
}

/**
 * The callback function
 * @deprecated
 */
export type SecurityCallback = (req: BaseRequest, ...args: any[]) => boolean;

/**
 * An interface for defining security callbacks with an identifier.
 * 
 * id - The identifier for the security callback.
 * also - The security rule to include in the callback.
 * when - The condition for when the security check should be executed. Defaults to 'always'.
 * never - The condition for when the security check should never be executed.
 * callback - The security callback function.
 * @deprecated
 */
export type IIdentifiableSecurityCallback = {
    id: string;
    also?: string | null;
    when: string[] | null;
    never: string[] | null;
    arguements?: Record<string, unknown>;
    callback: SecurityCallback;
}

 
export type ISecurityMiddleware = ({ route }: { route: IRouteLegacy }) => (req: BaseRequest, res: Response, next: NextFunction) => Promise<void>;

/**
 * Security request to be included in BaseRequest
 * @deprecated
 */
export default interface ISecurityRequestLegacy extends Request {
    security?: IIdentifiableSecurityCallback[]
}

/**
 * Security request to be included in BaseRequest
 */
export interface ISecurityRequest extends Request {
    security?: ISecurityRule[]
}