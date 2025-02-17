import appConfig, { IAppConfig } from "@src/config/app";
import BaseProvider from "@src/core/base/Provider";
import { app } from "@src/core/services/App";

import GenerateAppKey from "../commands/GenerateAppKey";
import CryptoService from "../service/CryptoService";

class CryptoProvider extends BaseProvider {

    config: IAppConfig = appConfig;

    async register(): Promise<void> {

        const config = {
            appKey: this.config.appKey
        }
        const cryptoService = new CryptoService(config)

        // Bind the crypto service
        this.bind('crypto', cryptoService)

        // Register commands
        app('console').register().registerAll([
            GenerateAppKey
        ])
    }
       
}

export default CryptoProvider