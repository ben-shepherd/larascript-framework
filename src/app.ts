import 'dotenv/config';

import appConfig from '@src/config/app';
import CommandNotFoundException from '@src/core/domains/console/exceptions/CommandNotFoundException';
import CommandBootService from '@src/core/domains/console/service/CommandBootService';
import Kernel, { KernelOptions } from '@src/core/Kernel';

(async () => {
    try {
        const args = process.argv.slice(2);
        const cmdBoot  = new CommandBootService();
        const options: KernelOptions = cmdBoot.getKernelOptions(args, {})
        
        /**
         * Boot the kernel
         */
        await Kernel.boot(appConfig, options);

        console.log('[App]: Started');

        /**
         * Execute commands
         */
        await cmdBoot.boot(args);
    
    } 
    catch (err) {
        
        // We can safetly ignore CommandNotFoundExceptions 
        if(err instanceof CommandNotFoundException) {
            return;
        }

        console.error('[App]: Failed to start', err);
        throw err;
    }
})();