export interface IAuthConfig {
    authService: new (config: IAuthConfig) => any;
    authRoutes: boolean;
    authCreateAllowed: boolean;
}