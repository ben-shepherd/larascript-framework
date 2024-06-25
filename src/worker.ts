import 'tsconfig-paths/register';

import appConfig from '@src/config/app';
import Kernel from "@src/core/kernel";
import MongoDBProvider from '@src/core/providers/MongoDBProvider';
import EventProvider from './core/domains/events/providers/EventProvider';
import Worker from './core/domains/events/services/Worker';

(async() => {
    require('dotenv').config();

    // Boot mongodb, events
    await Kernel.boot({
        ...appConfig,
        providers: [
            new MongoDBProvider(),
            new EventProvider()
        ]
    })

    const driver = process.env.APP_WORKER_DRIVER ?? 'queue';
    const worker = Worker.getInstance()
    
    worker.setDriver(driver)

    await worker.work()
    
    setInterval(async () => {
        worker.work()
        console.log('Running worker again in ' + worker.options.runAfterSeconds.toString() + ' seconds')
    }, worker.options.runAfterSeconds * 1000)
})();   