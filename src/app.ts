import 'dotenv/config';

import { Kernel, KernelOptions } from '@ben-shepherd/larascript-core-bundle';
import appConfig from '@src/config/app.config';
import providers from '@src/config/providers.config';
import CommandNotFoundException from '@src/core/domains/console/exceptions/CommandNotFoundException';
import CommandBootService from '@src/core/domains/console/service/CommandBootService';
import { loggerLegacy } from '@src/core/domains/logger/services/LoggerService';

(async () => {
    try {
        const args = process.argv.slice(2);
        const cmdBoot  = new CommandBootService();
        const options: KernelOptions = cmdBoot.getKernelOptions(args, {})
        const environment = appConfig.env
        
        /**
         * Boot the kernel
         */
        await Kernel.boot({ environment, providers }, options);
        loggerLegacy().info('[App]: Started');

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

        loggerLegacy().error('[App]: Failed to start', err);
        throw err;
    }
})();