import { IModel, IModelAttributes } from "@src/core/interfaces/IModel";

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