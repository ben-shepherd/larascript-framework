/* eslint-disable no-unused-vars */
 
import 'dotenv/config';
import 'tsconfig-paths/register';

import appConfig from '@src/config/app';
import providers from '@src/config/providers';
import Kernel from '@src/core/Kernel';
import { app } from '@src/core/services/App';
import testHelper from '@src/tests/testHelper';


const USE_TEST_DB = false;

(async () => {

    if(USE_TEST_DB) {
        await testHelper.testBootApp();
        await app('console').reader(['migrate:fresh', '--seed']).handle();
    }
    else {
        await Kernel.boot({
            environment: appConfig.env,
            providers: providers
        }, {});
    }

    const db        = app('db');
    const events    = app('events')     
    const query     = app('query');
    const validator = app('validator');
    
    /**
    * ADD YOUR CODE HERE
    */


})(); 