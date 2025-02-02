import { IModel, IModelAttributes } from "@src/core/interfaces/IModel";

/**
 * Strips guarded properties from model instances before sending them in HTTP responses
 * 
 * This utility function takes one or more model instances and removes any properties
 * marked as "guarded" before converting them to plain objects. This is useful when
 * sending model data in API responses to ensure sensitive fields (like passwords,
 * internal flags, etc.) are not exposed.
 * 
 * Example usage:
 * ```ts
 * const user = await User.findById(id);
 * const sanitizedUser = await stripGuardedResourceProperties(user);
 * res.json(sanitizedUser);
 * ```
 * 
 * @param results - A single model instance or array of model instances
 * @returns An array of plain objects with guarded properties removed
 */

const stripGuardedResourceProperties = async (results: IModel[] | IModel) => {
    const strippedResult: IModelAttributes[] = []

    if(!Array.isArray(results)) {
        results = [results];
    }

    for(const result of results) {
        strippedResult.push(await result.toObject({ excludeGuarded: true }) as IModelAttributes);
    }

    return strippedResult
}

export default stripGuardedResourceProperties