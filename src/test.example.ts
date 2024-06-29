import 'tsconfig-paths/register';

import appConfig from './config/app';
import Kernel from "./core/kernel";
import { App } from './core/services/App';

(async() => {
    require('dotenv').config();

    await Kernel.boot(appConfig, {})

    const auth = App.container('auth');
    const mongodb = App.container('mongodb');
    const events = App.container('events')
    const express = App.container('express')

    // add your tests here below
    
})();