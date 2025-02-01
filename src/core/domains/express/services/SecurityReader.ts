import { ALWAYS } from "@src/core/domains/express/enums/SecurityEnum";
import { TRouteItem } from "@src/core/domains/express/interfaces/IRoute";
import { ISecurityRule } from "@src/core/domains/express/interfaces/ISecurity";

class SecurityReader {

    /**
     * Converts the security rule constructors into an array of security rule options.
     * 
     * @param routeOptions - The route resource options containing the security rule constructors.
     * @returns An array of security rule options.
     */
    protected static getSecurityRulesArray(routeOptions: TRouteItem): ISecurityRule[] {
        return routeOptions.security ?? [];
    }

    /**
     * Finds a security callback in the security callbacks of the given route r
     * esource options.
     *
     * @param routeOptions - The route resource options containing the security callbacks.
     * @param id - The id of the security callback to find.
     * @param when - The optional when condition. If specified, the security callback will only be found if it matches this condition.
     * @returns The found security callback, or undefined if not found.
     */
    public static findFromRouteResourceOptions(routeOptions: TRouteItem, id: string, when?: string[] | null): ISecurityRule | undefined {
        return this.find(routeOptions, id, when);
    }

    /**
     * Finds a security callback in the given array of security callbacks.
     *
     * @param security - The array of security callbacks to search.
     * @param options - The route resource options containing the security callbacks.
     * @param id - The id of the security callback to find.
     * @param when - The when condition to match. If not provided, the method will return the first match.
     * @returns The security callback if found, or undefined if not found.
     */
    public static find<Rule extends ISecurityRule = ISecurityRule>(routeOptions: TRouteItem, id: string, when?: string[] | null): Rule | undefined {

        const securityRules = this.getSecurityRulesArray(routeOptions);

        let result: ISecurityRule | undefined = undefined;

        when = when ?? null;
        when = when && typeof when === 'string' ? [when] : when;

        // Checks if the condition should never be passable
        const conditionNeverPassable = (conditions: string[] | null, never: string[] | null = null) => {
            if(!never) return false;

            for(const neverCondition of never) { 
                if(conditions?.includes(neverCondition)) return true;
            }

            return false;
        }

        // Checks if the condition should be passable
        const conditionPassable = (condition: string[] | null) => {
            if(!condition) {
                return true;
            }

            condition = typeof condition === 'string' ? [condition] : condition;

            if(when?.includes(ALWAYS)) return true;

            for(const conditionString of condition) {
                if(when?.includes(conditionString)) {
                    return true;
                }
            }

            return false;
        }


        /**
         * Find by 'id'
         */
        result = securityRules.find(security => {
            const matchesIdentifier = security.getId() === id

            return matchesIdentifier && 
                conditionNeverPassable(when, security.getNever()) === false &&
                conditionPassable(security.getWhen());
        });

        /**
         * Includes security rule defined in optional 'also' property
         * 
         * Example: hasScope rule requires authorized rule
         */
        if(!result)  {

            // We need to find the unrelated security rule that has the ID in 'also' 
            const unrelatedSecurityRule = securityRules.find(security => {
                return security.getAlso() === id && 
                    conditionNeverPassable(when, security.getNever()) === false &&
                    conditionPassable(security.getWhen());
            });

            // The 'unrelatedSecurityRule' contains the 'also' property. 
            // We can use it to fetch the desired security rule.
            if(unrelatedSecurityRule) {
                return unrelatedSecurityRule as Rule;
            }
        }

        return result as Rule;
    }

}

export default SecurityReader