import { IRoute } from "@src/core/domains/express/interfaces/IRoute";
import { IModel, ModelConstructor } from "@src/core/interfaces/IModel";
import { ValidatorCtor } from "@src/core/domains/validator/types/ValidatorCtor";

export type ResourceType = 'index' | 'create' | 'update' | 'show' | 'delete';

export interface IRouteResourceOptions extends Pick<IRoute, 'middlewares'> {
    except?: ResourceType[];
    only?: ResourceType[];
    resource: ModelConstructor<IModel>;
    name: string;
    createValidator?: ValidatorCtor;
    updateValidator?: ValidatorCtor;
}