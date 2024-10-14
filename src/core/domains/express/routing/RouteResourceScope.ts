import { Scope } from "@src/core/domains/auth/interfaces/IScope";
import ModelScopes from "@src/core/domains/auth/services/ModelScopes";
import { ModelConstructor } from "@src/core/interfaces/IModel";


export const defaultRouteResourceScopes: Scope[] = ['all'];

export type GetScopesOptions = {
    resource: ModelConstructor,
    scopes?: Scope[] | Scope
}

class RouteResourceScope {

    /**
     * Generates a list of scopes, given a resource name and some scope types.
     * @param resource The model as a constructor
     * @param types The scope type(s) to generate scopes for. If a string, it will be an array of only that type.
     * @param additionalScopes Additional scopes to append to the output
     * @returns A list of scopes in the format of 'resourceName:scopeType'
     * 
     * Example:
     * 
     *     const scopes = RouteResourceScope.getScopes(BlogModel, ['write', 'read'], ['otherScope']) 
     *     
     *     // Output
     *     [
     *         'BlogModel:write',
     *         'BlogModel:read',
     *         'otherScope'    
     *     ]
     */
    public static getScopes(options: GetScopesOptions): string[] {
        const resource = options.resource
        let scopes = options.scopes ?? ModelScopes.getScopes(resource, ['all']);

        // Shape the scopes to an array
        scopes = typeof scopes === 'string' ? [scopes] : scopes;
        
        // Generate scopes from the resource
        const resourceScopes = ModelScopes.getScopes(resource, scopes as Scope[]);

        return [
            ...defaultRouteResourceScopes,
            ...resourceScopes
        ];
    }

}

export default RouteResourceScope