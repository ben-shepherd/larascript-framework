import 'dotenv/config';

import appConfig from './config/app';
import CommandEmptyArgument from './core/domains/console/exceptions/CommandEmptyArgument';
import Kernel, { KernelOptions } from './core/kernel';
import { App } from './core/services/App';

require('dotenv').config();

(async () => {
    try {
        const options: KernelOptions = {}
        const args = process.argv.slice(2);

        if(args.length) {
            options.withoutProvider = ['ExpressProvider', 'RoutesProvider']
        }

        if(args.includes('--no-db')) {
            options.withoutProvider?.push('MongoDBProvider');
        }

        await Kernel.boot(appConfig, options);

        console.log('[App]: Started successfully');

        try {
            App.container('console').reader(args).handle()
        }
        catch (err) {
            if(err instanceof CommandEmptyArgument === false) {
                throw err
            }
        }
    } catch (error) {
        console.error('[App]: Failed to start', error);
    }
})();
