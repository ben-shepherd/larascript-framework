import HttpContext from "../data/HttpContext";
import { TRouteItem } from "../interfaces/IRoute";
import { ISecurityRule, TSecurityRuleOptions } from "../interfaces/ISecurity";

abstract class AbstractSecurityRule<RuleOptions extends object = object> implements ISecurityRule<RuleOptions> {

    protected id!: string;

    protected when!: string[] | null;

    protected never!: string[] | null;

    protected also!: string | null;

    options?: RuleOptions;

    // eslint-disable-next-line no-unused-vars
    abstract execute(context: HttpContext, routeItem: TRouteItem): Promise<boolean>;

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
     * Converts the security rule to an object.
     * 
     * @param args The arguments to include in the object
     * @returns The security rule object
     */
    public toObject(): TSecurityRuleOptions<RuleOptions> {
        return {
            id: this.id,
            when: this.when,
            never: this.never,
            also: this.also,
            ruleOptions: this.options,
        }
    }

    public getId(): string {
        return this.id;
    }

    public getWhen(): string[] | null {
        return this.when;
    }

    public getNever(): string[] | null {
        return this.never;
    }

    public getAlso(): string | null {
        return this.also;
    }

}

export default AbstractSecurityRule;