export interface IPermissionGroup {
    name: string;
    scopes?: string[];
    roles?: string[];
}

export interface IPermissionUser {
    defaultGroup: string;
}

export interface IPermissionsConfig {
    user: IPermissionUser;
    groups: IPermissionGroup[]
}