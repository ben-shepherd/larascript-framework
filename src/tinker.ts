import 'tsconfig-paths/register';

import appConfig from '@src/config/app';
import Kernel from "@src/core/Kernel";
import { App } from '@src/core/services/App';
import { TestMovieModel } from './tests/models/models/TestMovie';

(async () => {
    require('dotenv').config();

    await Kernel.boot(appConfig, {})

    const auth = App.container('auth');
    const db = App.container('db');
    const events = App.container('events')
    const express = App.container('express')
    const cnsl = App.container('console');
    const validator = App.container('validate')

    // add your tinkers below
    const model = new TestMovieModel({
        name: 'Test Movie',
    });

    console.log('Tinker', 'inserting')
    await model.save();


    model.setAttribute('name', 'Test Movie 2')
    console.log('Tinker', 'updating')
    await model.save();

    // console.log('Tinker', 'deleting')
    // await model.delete();
    // console.log(model)

})(); 