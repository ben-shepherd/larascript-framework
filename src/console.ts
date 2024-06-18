import 'tsconfig-paths/register';
import appConfig from './config/app';
import ConsoleProvider from './core/domains/console/providers/ConsoleProvider';
import CommandRegister from './core/domains/console/service/CommandRegister';
import EventProvider from './core/domains/events/providers/EventProvider';
import Kernel from './core/kernel';
import MongoDBProvider from './core/providers/MongoDBProvider';
import { App } from './core/services/App';

require('dotenv').config();

(async () => {
    try {

        await Kernel.boot({
            ...appConfig,
            providers: [
                new EventProvider(),
                new MongoDBProvider(),
                new ConsoleProvider()
            ]
        });
        
        console.log('[App]: Console started successfully', CommandRegister.getInstance().getRegistered(), { argv: process.argv });

        const args = process.argv.slice(2);

        App.container('console').reader(args).handle()

    } catch (error) {
        console.error('[App]: Failed to start', error);
    }
})();
