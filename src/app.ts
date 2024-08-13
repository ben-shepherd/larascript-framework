import 'dotenv/config';

import appConfig from './config/app';
import CommandNotFoundException from './core/domains/console/exceptions/CommandNotFoundException';
import CommandBootService from './core/domains/console/service/CommandBootService';
import Kernel, { KernelOptions } from './core/Kernel';

require('dotenv').config();

(async () => {
    try {
        const args = process.argv.slice(2);
        const cmdBoot  = new CommandBootService();
        const options: KernelOptions = cmdBoot.getKernelOptions(args, {})
        
        await Kernel.boot(appConfig, options);

        try {
            await cmdBoot.boot(args);
        }
        catch (err) {
            if(!(err instanceof CommandNotFoundException)) {
                throw err
            }
        }
        
    } catch (error) {
        console.error('[App]: Failed to start', error);
    }

    console.log('[App]: Started');
})();
function DetectCommandService() {
    throw new Error('Function not implemented.');
}

