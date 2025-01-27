import { TExpressMiddlewareFn } from "../interfaces/IMiddleware";
import { ISecurityRule } from "../interfaces/ISecurity";
import { TSecurityRuleOptions } from "../services/Security/SecurityService";

abstract class SecurityRule<Arguments extends object = object> implements ISecurityRule<Arguments> {

    protected id: string;

    protected when: string[] | null;

    protected never: string[] | null;

    protected middleware?: TExpressMiddlewareFn;

    protected arguements?: Arguments;

    constructor({id, when, never, arguements, middleware}: TSecurityRuleOptions<Arguments>) {
        this.id = id;
        this.when = when;
        this.never = never;
        this.middleware = middleware;
        this.arguements = arguements
    }

    /**
     * Converts the security rule to an object.
     * 
     * @param args The arguments to include in the object
     * @returns The security rule object
     */
    public toObject(args: Arguments = {} as Arguments): TSecurityRuleOptions<Arguments> {
        return {
            id: this.id,
            when: this.when,
            never: this.never,
            middleware: this.middleware,
            arguements: {
                ...(this.arguements ?? {}),
                ...args
            } as Arguments,
        }
    }

}

export default SecurityRule;