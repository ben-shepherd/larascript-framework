import ResourceException from "@src/core/domains/express/exceptions/ResourceException";
import HttpContext from "@src/core/domains/http/context/HttpContext";
import { ISecurityRule } from "@src/core/domains/http/interfaces/ISecurity";

/**
 * AbstractSecurityRule is a base class for implementing security rules in HTTP requests.
 * 
 * This abstract class provides the foundation for creating security rules that can be applied
 * to routes and endpoints. Security rules are used to enforce access control, validate requests,
 * and implement other security-related checks.
 * 
 * Key features:
 * - Configurable conditions for when rules should be applied (when/never)
 * - Generic type support for rule-specific options
 * - Extensible execute() method for implementing rule logic
 * 
 * Example usage:
 * ```ts
 * class AdminOnlyRule extends AbstractSecurityRule {
 *   protected readonly id = 'admin-only';
 *   
 *   public async execute(context: HttpContext): Promise<boolean> {
 *     return context.user?.role === 'admin';
 *   }
 * }
 * ```
 * 
 * Security rules can be attached to routes and will be evaluated before
 * the route handler executes. If any rule returns false or throws an exception,
 * the request will be rejected.
 */
abstract class AbstractSecurityRule<RuleOptions extends object = object> implements ISecurityRule<RuleOptions> {

    /**
     * The ID of the security rule.
     */
    protected abstract readonly id: string;

    /**
     * The conditions under which the security rule should be applied.
     */
    protected when!: string[] | null;

    /**
     * The conditions under which the security rule should not be applied.
     */
    protected never!: string[] | null;

    /**
     * The ID of the security rule to include in the security rule object.
     */
    protected also!: string | null;

    /**
     * The options for the security rule.
     */
    public options?: RuleOptions;

    /**
     * Executes the security rule.
     * 
     * @param context The context
     * @param args The arguments
     * @returns The result of the security rule
     */
    // eslint-disable-next-line no-unused-vars
    public async execute(context: HttpContext, ...args: any[]): Promise<boolean> {
        return true;
    }

    /**
     * Sets the options for the security rule.
     * 
     * @param options The options for the security rule
     * @returns The security rule
     */
    public setRuleOptions(options: RuleOptions): ISecurityRule<RuleOptions> {
        this.options = options;
        return this as ISecurityRule<RuleOptions>;
    }

    /**
     * Gets the rule options.
     * 
     * @returns The rule options
     */
    public getRuleOptions(): RuleOptions {
        return this.options as RuleOptions;
    }

    /**
     * Gets the ID of the security rule.
     * 
     * @returns The ID of the security rule
     */
    public getId(): string {
        if(!this.id) {
            throw new ResourceException('Security rule ID is not set');
        }

        return this.id;
    }

    /**
     * Gets the conditions under which the security rule should be applied.
     * 
     * @returns The conditions under which the security rule should be applied
     */
    public getWhen(): string[] | null {
        return this.when;
    }

    /**
     * Gets the conditions under which the security rule should not be applied.
     * 
     * @returns The conditions under which the security rule should not be applied
     */
    public getNever(): string[] | null {
        return this.never;
    }

    /**
     * Gets the ID of the security rule to include in the security rule object.
     * 
     * @returns The ID of the security rule to include in the security rule object
     */
    public getAlso(): string | null {
        return this.also;
    }

}

export default AbstractSecurityRule;