import { IRoute } from "@src/core/domains/express/interfaces/IRoute";
import { IIdentifiableSecurityCallback } from "@src/core/domains/express/interfaces/ISecurity";
import { ValidatorCtor } from "@src/core/domains/validator/types/ValidatorCtor";
import { IModel, ModelConstructor } from "@src/core/interfaces/IModel";


export type ResourceType = 'all' | 'create' | 'update' | 'show' | 'destroy';

export type SearchOptions = {
    fields: string[];
    useFuzzySearch?: boolean; // Only applies to MongoDB provider
}

export interface IRouteResourceOptions extends Pick<IRoute, 'middlewares'> {
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
    searching?: SearchOptions
}