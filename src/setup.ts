import 'tsconfig-paths/register';

import appConfig from '@src/config/app.config';
import ConsoleProvider from '@src/core/domains/console/providers/ConsoleProvider';
import CryptoProvider from '@src/core/domains/crypto/providers/CryptoProvider';
import DatabaseSetupProvider from '@src/core/domains/database/providers/DatabaseSetupProvider';
import LoggerProvider from '@src/core/domains/logger/providers/LoggerProvider';
import SetupProvider from '@src/core/domains/setup/providers/SetupProvider';
import Kernel from "@src/core/Kernel";
import { AppSingleton } from '@src/core/services/App';

(async () => {
    require('dotenv').config();

    await Kernel.boot({
        ...appConfig,
        environment: 'testing',
        providers: [
            new LoggerProvider(),
            new ConsoleProvider(),
            new DatabaseSetupProvider(),
            new CryptoProvider(),
            new SetupProvider()
        ]
    }, {})

    await AppSingleton.container('console').readerService(['app:setup']).handle();
})();