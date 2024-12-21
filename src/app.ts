import 'dotenv/config';

import appConfig from '@src/config/app';
import providers from '@src/config/providers';
import CommandNotFoundException from '@src/core/domains/console/exceptions/CommandNotFoundException';
import CommandBootService from '@src/core/domains/console/service/CommandBootService';
import Kernel, { KernelOptions } from '@src/core/Kernel';

import { logger } from './core/domains/logger/services/LoggerService';

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
        logger().info('[App]: Started');

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

        logger().error('[App]: Failed to start', err);
        throw err;
    }
})();