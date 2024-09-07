import 'dotenv/config';
import 'tsconfig-paths/register';

import appConfig from '@src/config/app';
import Kernel from "@src/core/Kernel";
import TestDatabaseProvider from './tests/providers/TestDatabaseProvider';

(async () => {
    await Kernel.boot({
        ...appConfig,
        providers: [
            new TestDatabaseProvider(),
            ...appConfig.providers,
        ]
    }, {
        withoutProvider: ['DatabaseProvider']
    })

    // const auth = App.container('auth');
    // const db = App.container('db');
    // const events = App.container('events')
    // const express = App.container('express')
    // const cnsl = App.container('console');
    // const validator = App.container('validate')

    // add your tinkers below

})(); 