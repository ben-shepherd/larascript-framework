import { MiddlewareConstructor, TExpressMiddlewareFn } from "../../interfaces/IMiddleware";

export type TSecurityRulesObject = {
     
    [key: string]: TSecurityMiddlewareFn
}

export type TSecurityMiddlewareFn = (...args: any[]) => MiddlewareConstructor;

export type TSecurityRule<Arguments extends object = object> = {
    id: string;
    also?: string | null;
    when: string[] | null;
    never: string[] | null;
    arguements?: Arguments;
    middleware?: TExpressMiddlewareFn;
}

class SecurityService {

    protected securityRules: TSecurityRulesObject = {};


    /**
     * Adds a security rule to the service.
     * 
     * @param key The key of the security rule to add
     * @param securityFn The security rule function
     */
    public addRule(key: string, securityFn: TSecurityMiddlewareFn): void {
        this.securityRules[key] = securityFn;
    }

    /**
     * Gets a security rule by its key.
     * 
     * @param key The key of the security rule to get
     * @returns The security rule function
     */
    public getRule(key: string): TSecurityMiddlewareFn | undefined {
        return this.securityRules[key];
    }

}

export default SecurityService;