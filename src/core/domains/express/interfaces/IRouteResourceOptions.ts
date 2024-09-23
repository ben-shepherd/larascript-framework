import { IdentifiableSecurityCallback } from "@src/core/domains/auth/services/Security";
import { IRoute } from "@src/core/domains/express/interfaces/IRoute";
import { ValidatorCtor } from "@src/core/domains/validator/types/ValidatorCtor";
import { IModel, ModelConstructor } from "@src/core/interfaces/IModel";

export type ResourceType = 'index' | 'create' | 'update' | 'show' | 'delete';

export interface IRouteResourceOptions extends Pick<IRoute, 'middlewares'> {
    except?: ResourceType[];
    only?: ResourceType[];
    resource: ModelConstructor<IModel>;
    name: string;
    createValidator?: ValidatorCtor;
    updateValidator?: ValidatorCtor;
    security?: IdentifiableSecurityCallback[];
}