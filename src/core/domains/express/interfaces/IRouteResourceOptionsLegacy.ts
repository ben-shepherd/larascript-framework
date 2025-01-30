import { IRouteLegacy } from "@src/core/domains/express/interfaces/IRouteLegacy";
import { IIdentifiableSecurityCallback } from "@src/core/domains/express/interfaces/ISecurity";
import { ValidatorCtor } from "@src/core/domains/validator/types/ValidatorCtor";
import { IModel, ModelConstructor } from "@src/core/interfaces/IModel";


export type ResourceType = 'all' | 'create' | 'update' | 'show' | 'destroy';

export type SearchOptionsLegacy = {
    fields: string[];
}

export interface IRouteResourceOptionsLegacy extends Pick<IRouteLegacy, 'middlewares'> {
    path: string;
    resource: ModelConstructor<IModel>;
    except?: ResourceType[];
    only?: ResourceType[];
    createValidator?: ValidatorCtor;
    updateValidator?: ValidatorCtor;
    security?: IIdentifiableSecurityCallback[];
    scopes?: string[];
    enableScopes?: boolean;
    showFilters?: object;
    allFilters?: object;
    paginate?: {
        pageSize: number;
        allowPageSizeOverride?: boolean;
    },
    searching?: SearchOptionsLegacy
}