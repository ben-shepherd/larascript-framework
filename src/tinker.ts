/* eslint-disable no-unused-vars */
 
import 'dotenv/config';
import 'tsconfig-paths/register';

import { app } from '@src/core/services/App';
import testHelper from '@src/tests/testHelper';

(async () => {

    await testHelper.testBootApp();

    const auth    = app('auth');
    const db      = app('db');
    const events  = app('events')     
    const cnsl    = app('console');
    const query   = app('query');
   
    // ADD YOUR CODE HERE

    
})(); 