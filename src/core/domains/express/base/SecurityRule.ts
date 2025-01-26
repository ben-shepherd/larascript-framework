import { TExpressMiddlewareFn } from "../interfaces/IMiddleware";
import { TSecurityRule } from "../services/Security/SecurityService";

abstract class SecurityRule<Arguments extends object = object> {

    protected id: string;

    protected when: string[] | null;

    protected never: string[] | null;

    protected middleware?: TExpressMiddlewareFn;

    protected arguements?: Arguments;

    constructor({id, when, never, arguements, middleware}: TSecurityRule<Arguments>) {
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
    protected toObject(args: Arguments = {} as Arguments): TSecurityRule<Arguments> {
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