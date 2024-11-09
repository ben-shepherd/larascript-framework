/* eslint-disable no-undef */
import { describe, expect } from '@jest/globals';
import { App } from '@src/core/services/App';

import testHelper from '../testHelper';

describe('attempt to connect to MongoDB database', () => {

    /**
   * Boot the MongoDB provider
   */
    beforeAll(async () => {
        await testHelper.testBootApp()
    })

    /**
   * Test the MongoDB connection
   */
    test('test db connection',async () => {
        const db = App.container('db');
        expect(db).toBeTruthy();

        await db.boot();
        expect(db).toBeTruthy();
    });
});