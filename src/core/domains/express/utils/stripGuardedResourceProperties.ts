import { IModel } from "@src/core/interfaces/IModel";
import IModelAttributes from "@src/core/interfaces/IModelData";

const stripGuardedResourceProperties = async (results: IModel<IModelAttributes>[] | IModel<IModelAttributes>) => {
    if(!Array.isArray(results)) {
        return await results.getData({ excludeGuarded: true })
    }

    return results.map(async result => await result.getData({ excludeGuarded: true }));
}

export default stripGuardedResourceProperties