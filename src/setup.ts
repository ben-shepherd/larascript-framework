import 'tsconfig-paths/register';

import appConfig from '@src/config/app';
import Kernel from "@src/core/Kernel";
import { App } from '@src/core/services/App';
import ConsoleProvider from './core/domains/console/providers/ConsoleProvider';
import SetupProvider from './core/domains/setup/providers/SetupProvider';

(async() => {
    require('dotenv').config();

    await Kernel.boot({
      ...appConfig,
      providers: [
        new ConsoleProvider(),
        new SetupProvider()
      ]
    }, {})

    await App.container('console').reader(['app:setup']).handle();
})();