import BaseProvider from "@src/core/base/Provider";
import { app } from "@src/core/services/App";

import GenerateAppKey from "../commands/GenerateAppKey";
import CryptoService from "../service/CryptoService";

class CryptoProvider extends BaseProvider {

    async register(): Promise<void> {
        this.bind('crypto', new CryptoService())

        // Register commands
        app('console').register().registerAll([
            GenerateAppKey
        ])
    }
       
}

export default CryptoProvider