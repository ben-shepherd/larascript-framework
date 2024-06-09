import { EnvironmentType } from '../core/consts/Environment';
import IAppConfig from '../core/interfaces/IAppConfig';
import AuthProvider from '../core/providers/AuthProvider';
import ExpressListenerProvider from '../core/providers/ExpressListenerProvider';
import ExpressProvider from '../core/providers/ExpressProvider';
import MongoDBProvider from '../core/providers/MongoDBProvider';
import RoutesProvider from '../core/providers/RoutesProvider';

const appConfig: IAppConfig = {
    environment: (process.env.APP_ENV as EnvironmentType) ?? 'development',
    
    providers: [
        new MongoDBProvider(),
        new ExpressProvider(),
        new RoutesProvider(),
        new AuthProvider(),
        new ExpressListenerProvider(),
    ],
};

export default appConfig;
