/* eslint-disable no-unused-vars */
 
import 'dotenv/config';
import 'tsconfig-paths/register';

import TinkerService from '@src/core/domains/tinker/services/TinkerService';
import { app } from '@src/core/services/App';
(async () => {

    // Boot the application
    // By default, it will boot the regular database
    // If you want to boot the test database, you can pass `useTestDb: true`
    await TinkerService.boot({
        useTestDb: false
    });

    // Useful services for debugging
    const db        = app('db');
    const events    = app('events');
    const logger    = app('logger');
    const query     = app('query');
    const validator = app('validator');
    
    // Add your code here

})(); 