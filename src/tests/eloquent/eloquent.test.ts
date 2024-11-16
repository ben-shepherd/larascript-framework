/* eslint-disable no-undef */
import { describe } from '@jest/globals';
import testHelper from '@src/tests/testHelper';

import TestUser from '../models/models/TestUser';

describe('eloquent', () => {

    beforeAll(async () => {
        await testHelper.testBootApp()
    });

    test('', async () => {

        const builder = TestUser.query();

        console.log(builder);

    });
});