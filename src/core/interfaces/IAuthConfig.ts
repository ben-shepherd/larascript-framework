export interface IAuthConfig {
    userRepository: new (...args: any[]) => any;
    apiTokenRepository: new (...args: any[]) => any;
    authRoutes: boolean;
    authCreateAllowed: boolean;
}