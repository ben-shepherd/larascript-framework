import 'dotenv/config';
import MongoDB from './services/MongoDB';
import Express from './services/Express';


(async () => {
    try {
        // Connect to database
        await MongoDB.getInstance().connect();
        console.log('Database connected successfully');

        // Setup Express
        Express.getApp();

    } catch (error) {
        console.error('Failed to start app', error);
    }
})();
