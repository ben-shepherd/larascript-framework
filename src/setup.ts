import 'tsconfig-paths/register';

import appConfig from '@src/config/app';
import ConsoleProvider from '@src/core/domains/console/providers/ConsoleProvider';
import SetupProvider from '@src/core/domains/setup/providers/SetupProvider';
import Kernel from "@src/core/Kernel";
import { App } from '@src/core/services/App';

import DatabaseProvider from './core/domains/database/providers/DatabaseProvider';
import LoggerProvider from './core/domains/logger/providers/LoggerProvider';

(async() => {
    require('dotenv').config();

    await Kernel.boot({
        ...appConfig,
        providers: [
            new LoggerProvider(),
            new ConsoleProvider(),
            new DatabaseProvider(),
            new SetupProvider()
        ]
    }, {})

    await App.container('console').reader(['app:setup']).handle();
})();