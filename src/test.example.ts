import 'tsconfig-paths/register';

import appConfig from '@src/config/app';
import Kernel from "@src/core/Kernel";
import { App } from '@src/core/services/App';

(async() => {
    require('dotenv').config();

    await Kernel.boot(appConfig, {})

    const auth = App.container('auth');
    const mongodb = App.container('mongodb');
    const events = App.container('events')
    const express = App.container('express')

    // add your tests here below
    
})();