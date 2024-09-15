import 'dotenv/config';
import 'tsconfig-paths/register';

import appConfig from '@src/config/app';
import Kernel from "@src/core/Kernel";
import TestDatabaseProvider from '@src/tests/providers/TestDatabaseProvider';
import Joi from 'joi';

import { App } from './core/services/App';

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

    // Get the validation service
    const validatorService = App.container('validate');

    // Create a validator
    const validator = validatorService.validator(
        Joi.object({
            email: Joi.string().email().required()
        })
    );

    // Validate the payload
    const result = await validator.validate({
        email: 'badEmail@examplecom',
    })

    // Print the result
    console.log(result.success, result.joi.error)
})(); 