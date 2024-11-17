/* eslint-disable no-undef */
import { describe } from '@jest/globals';
import TestUser from '@src/tests/models/models/TestUser';
import testHelper from '@src/tests/testHelper';

describe('eloquent', () => {

    beforeAll(async () => {
        await testHelper.testBootApp()
    });

    test('', async () => {

        const builder = TestUser.query();

        console.log(builder);

    });
});