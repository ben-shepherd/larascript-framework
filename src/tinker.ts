import 'tsconfig-paths/register';

import appConfig from '@src/config/app';
import Kernel from "@src/core/Kernel";
import { App } from './core/services/App';

(async () => {
    require('dotenv').config();

    await Kernel.boot(appConfig, {})

    const auth = App.container('auth');
    const mongodb = App.container('mongodb');
    const events = App.container('events')
    const express = App.container('express')
    const cnsl = App.container('console');
    const validator = App.container('validate')

    process.on('unhandledRejection', (reason, p) => {
        console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
    });

    // add your tinkers below


})();