import { Scope } from "@src/core/domains/auth/interfaces/IScope";
import { ModelConstructor } from "@src/core/interfaces/IModel";

class ModelScopes {

    /**
     * Generates a list of scopes, given a model name and some scope types.
     * 
     * Available Scopes
     * - all - All scopes
     * - read - Read scopes
     * - write - Write scopes
     * - delete - Delete scopes
     * - create - Create scopes
     * 
     * @param model The model as a constructor
     * @param scopes The scope type(s) to generate scopes for. If a string, it will be an array of only that type.
     * @returns A list of scopes in the format of 'modelName:scopeType'
     * 
     * Example:
     * 
     *     const scopes = ModelScopes.getScopes(BlogModel, ['write', 'read']) 
     *     
     *     // Output
     *     [
     *         'BlogModel:write',
     *         'BlogModel:read'
     *     ]
     */
    public static getScopes(model: ModelConstructor, scopes: Scope[] = ['all'], additionalScopes: string[] = []): string[] {
        return [...scopes.map((scope) => `${(model.name)}:${scope}`), ...additionalScopes];
    }

}

export default ModelScopes