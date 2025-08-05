import { EnvironmentTesting } from "@src/core/consts/Environment";
import CryptoProvider from "@src/core/domains/crypto/providers/CryptoProvider";

import { TestAppConfig } from "../config/testConfig";

class TestCryptoProvider extends CryptoProvider {

    config: TestAppConfig = {
        env: EnvironmentTesting,
        appKey: 'test-app-key',
        appName: 'Larascript Framework'
    }

}

export default TestCryptoProvider