export type RouteResourceScopeType = 'read' | 'write' | 'delete' | 'all';

export const defaultRouteResourceScopes: RouteResourceScopeType[] = ['read', 'write', 'delete', 'all'];

export type GetScopesOptions = {
    name: string,
    types?: RouteResourceScopeType[] | RouteResourceScopeType,
    additionalScopes?: string[]
}

class RouteResourceScope {

    /**
     * Generates a list of scopes, given a resource name and some scope types.
     * @param name The name of the resource
     * @param types The scope type(s) to generate scopes for. If a string, it will be an array of only that type.
     * @param additionalScopes Additional scopes to append to the output
     * @returns A list of scopes in the format of 'resourceName:scopeType'
     * 
     * Example:
     * 
     *     const scopes = RouteResourceScope.getScopes('blog', ['write', 'all'], ['otherScope']) 
     *     
     *     // Output
     *     [
     *         'blog:write',
     *         'blog:all',
     *         'otherScope'    
     *     ]
     */
    public static getScopes(options: GetScopesOptions): string[] {
        const {
            name,
            types = defaultRouteResourceScopes,
            additionalScopes = []
        } = options

        const typesArray = typeof types === 'string' ? [types] : types;
        
        return [
            ...typesArray.map(type => `${name}:${type}`),
            ...additionalScopes
        ];
    }

}

export default RouteResourceScope