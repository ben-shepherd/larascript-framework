/* eslint-disable no-unused-vars */
 
import 'dotenv/config';
import 'tsconfig-paths/register';

import appConfig from '@src/config/app';
import Kernel from '@src/core/Kernel';
import LarascriptProviders from '@src/core/providers/LarascriptProviders';
import { app } from '@src/core/services/App';
import testHelper from '@src/tests/testHelper';

const USE_TEST_DB = false;

(async () => {

    if(USE_TEST_DB) {
        await testHelper.testBootApp();
        await app('console').reader(['migrate:fresh', '--seed', '--confirm']).handle();
    }
    else {
        await Kernel.boot({
            environment: appConfig.env,
            providers: LarascriptProviders
        }, {});
    }

    const db      = app('db');
    const events  = app('events')     
    const query   = app('query');

    /**
    * ADD YOUR CODE HERE
    */
    
})(); 