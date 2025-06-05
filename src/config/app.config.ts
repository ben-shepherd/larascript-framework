import { EnvironmentDevelopment, EnvironmentType } from '@src/core/consts/Environment';

// App configuration type definition
export type IAppConfig = {
    appKey: string;
    env: EnvironmentType;
    appName: string;
}

// App configuration
const appConfig: IAppConfig = {

    appName: 'Larascript Framework',

    // App key
    appKey: process.env.APP_KEY ?? '',

    // Environment
    env: (process.env.APP_ENV as EnvironmentType) ?? EnvironmentDevelopment,

};

export default appConfig;
