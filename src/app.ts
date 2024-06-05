import Kernel from './core/kernel';

require('dotenv').config();

(async () => {
    try {
        await Kernel.boot();
        console.log('App started successfully');

    } catch (error) {
        console.error('Failed to start app', error);
    }
})();
