import 'tsconfig-paths/register';
import appConfig from './config/app';
import Kernel from './core/kernel';

require('dotenv').config();

(async () => {
    try {
        await Kernel.boot(appConfig);
        console.log('[App]: Started successfully');

    } catch (error) {
        console.error('[App]: Failed to start', error);
    }
})();
