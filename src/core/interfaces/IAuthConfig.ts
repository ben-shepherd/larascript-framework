export interface IAuthConfig {
    container: new (config: IAuthConfig) => any;
    userRepository: new () => any;
    apiTokenRepository: new () => any;
    authRoutes: boolean;
    authCreateAllowed: boolean;
}