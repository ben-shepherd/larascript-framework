import 'dotenv/config';
import 'tsconfig-paths/register';

import { App } from '@src/core/services/App';
import testHelper from '@src/tests/testHelper';

import BaseRegister from './core/base/BaseRegister';
import DatabaseAdapter from './core/domains/database/services/DatabaseAdapter';

class TinkerClass extends BaseRegister {

    static readonly COUNTRIES_AND_CITIES = 'countriesAndCities';

}

(async () => {

    await testHelper.testBootApp()

    // const auth = App.container('auth');
    const db = App.container('db');
    // const events = App.container('events')
    // const express = App.container('express')                         
    // const cnsl = App.container('console');


    

    console.log('adapters', db.getAllAdapterConstructors())

    console.log(
        DatabaseAdapter.getComposerShortFileNames()
    )
})(); 