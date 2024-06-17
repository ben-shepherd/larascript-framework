import 'tsconfig-paths/register';
import appConfig from './config/app';
import ConsoleProvider from './core/domains/console/providers/ConsoleProvider';
import EventProvider from './core/domains/events/providers/EventProvider';
import Kernel from './core/kernel';
import MongoDBProvider from './core/providers/MongoDBProvider';

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
        
        console.log('[App]: Started successfully');

    } catch (error) {
        console.error('[App]: Failed to start', error);
    }
})();
