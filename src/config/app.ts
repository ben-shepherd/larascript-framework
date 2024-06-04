import IAppConfig from "../interfaces/IAppConfig";
import ExpressListenerProvider from "../providers/ExpressListenerProvider";
import ExpressProvider from "../providers/ExpressProvider";
import MongoDBProvider from "../providers/MongoDBProvider";
import RoutesProvider from "../providers/RoutesProvider";

const appConfig: IAppConfig = {
    providers: [
        new ExpressProvider(),
        new RoutesProvider(),
        new ExpressListenerProvider(),
        new MongoDBProvider(),
    ],
};

export default appConfig;
