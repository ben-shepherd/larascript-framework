export interface IAclConfig {
    defaultGroup: string;
    groups: IAclGroup[];
    roles: IAclRole[];
}

export interface IAclGroup {
    name: string;
    roles: string[];
}

export interface IAclRole {
    name: string;
    scopes: string[];
}









