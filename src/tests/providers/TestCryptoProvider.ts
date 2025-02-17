import { IAppConfig } from "@src/config/app";
import { EnvironmentTesting } from "@src/core/consts/Environment";
import CryptoProvider from "@src/core/domains/crypto/providers/CryptoProvider";

class TestCryptoProvider extends CryptoProvider {

    config: IAppConfig = {
        env: EnvironmentTesting,
        appKey: 'test-app-key'
    }
    
}

export default TestCryptoProvider