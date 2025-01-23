 
import 'dotenv/config';
import 'tsconfig-paths/register';

import testHelper from '@src/tests/testHelper';

import { app } from './core/services/App';

(async () => {

    await testHelper.testBootApp();

    const auth    = app('auth');
    const db      = app('db');
    const events  = app('events')     
    const cnsl    = app('console');
    const query   = app('query');
   
    // ADD YOUR CODE HERE

    
})(); 