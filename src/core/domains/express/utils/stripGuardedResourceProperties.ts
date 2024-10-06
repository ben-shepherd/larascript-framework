import { IModel } from "@src/core/interfaces/IModel";
import IModelData from "@src/core/interfaces/IModelData";

const stripGuardedResourceProperties = (results: IModel<IModelData>[] | IModel<IModelData>) => {
    if(!Array.isArray(results)) {
        return results.getData({ excludeGuarded: true }) as IModel
    }

    return results.map(result => result.getData({ excludeGuarded: true }) as IModel);
}

export default stripGuardedResourceProperties